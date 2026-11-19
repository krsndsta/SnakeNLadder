import React from 'react';
import { BOARD_PORTALS, type BoardPortal } from '../../data/boardConfig.ts';
import { getCellCoordinates } from '../../utils/boardCoordinates.ts';

function getCellCenter(cellNumber: number): { x: number; y: number } {
  const { row, col } = getCellCoordinates(cellNumber);
  // In a 1000x1000 viewBox, each cell is 100x100
  return {
    x: col * 100 + 50,
    y: row * 100 + 50,
  };
}

export const BoardOverlay: React.FC = () => {
  return (
    <svg
      className="board-svg-overlay"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Filter for ladder/snake shadows */}
        <filter id="portal-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
        </filter>

        {/* Gradient for ladders */}
        <linearGradient id="ladder-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Gradient for snakes */}
        <linearGradient id="snake-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Render Ladders first */}
      <g className="svg-ladders" filter="url(#portal-shadow)">
        {BOARD_PORTALS.filter((p) => p.type === 'ladder').map((portal) => (
          <LadderElement key={portal.id} portal={portal} />
        ))}
      </g>

      {/* Render Snakes on top of ladders */}
      <g className="svg-snakes" filter="url(#portal-shadow)">
        {BOARD_PORTALS.filter((p) => p.type === 'snake').map((portal) => (
          <SnakeElement key={portal.id} portal={portal} />
        ))}
      </g>
    </svg>
  );
};

interface LadderElementProps {
  portal: BoardPortal;
}

const LadderElement: React.FC<LadderElementProps> = ({ portal }) => {
  const p1 = getCellCenter(portal.from);
  const p2 = getCellCenter(portal.to);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return null;

  // Unit perpendicular vector
  const nx = -dy / length;
  const ny = dx / length;

  const width = 12; // Half-width of ladder (24px total)

  // Left and right rails
  const leftX1 = p1.x + nx * width;
  const leftY1 = p1.y + ny * width;
  const leftX2 = p2.x + nx * width;
  const leftY2 = p2.y + ny * width;

  const rightX1 = p1.x - nx * width;
  const rightY1 = p1.y - ny * width;
  const rightX2 = p2.x - nx * width;
  const rightY2 = p2.y - ny * width;

  // Generate rungs along ladder length
  const rungSpacing = 32;
  const rungCount = Math.max(2, Math.floor(length / rungSpacing));
  const rungs = [];

  for (let i = 1; i < rungCount; i++) {
    const t = i / rungCount;
    const rx1 = leftX1 + (leftX2 - leftX1) * t;
    const ry1 = leftY1 + (leftY2 - leftY1) * t;
    const rx2 = rightX1 + (rightX2 - rightX1) * t;
    const ry2 = rightY1 + (rightY2 - rightY1) * t;

    rungs.push(
      <line
        key={i}
        x1={rx1}
        y1={ry1}
        x2={rx2}
        y2={ry2}
        stroke="url(#ladder-grad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    );
  }

  return (
    <g className="ladder-item" opacity="0.92">
      {/* Rails */}
      <line
        x1={leftX1}
        y1={leftY1}
        x2={leftX2}
        y2={leftY2}
        stroke="url(#ladder-grad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1={rightX1}
        y1={rightY1}
        x2={rightX2}
        y2={rightY2}
        stroke="url(#ladder-grad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Rungs */}
      {rungs}
    </g>
  );
};

interface SnakeElementProps {
  portal: BoardPortal;
}

const SnakeElement: React.FC<SnakeElementProps> = ({ portal }) => {
  // Head is at 'from', Tail is at 'to'
  const head = getCellCenter(portal.from);
  const tail = getCellCenter(portal.to);

  const dx = tail.x - head.x;
  const dy = tail.y - head.y;
  const dist = Math.hypot(dx, dy);

  // Perpendicular curve amplitude for snake s-curve
  const normalX = -dy / (dist || 1);
  const normalY = dx / (dist || 1);

  // Slight wave wobble
  const curveOffset = Math.min(60, dist * 0.25);
  const ctrl1X = head.x + dx * 0.3 + normalX * curveOffset;
  const ctrl1Y = head.y + dy * 0.3 + normalY * curveOffset;
  const ctrl2X = head.x + dx * 0.7 - normalX * curveOffset;
  const ctrl2Y = head.y + dy * 0.7 - normalY * curveOffset;

  const pathD = `M ${head.x} ${head.y} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${tail.x} ${tail.y}`;

  // Angle of snake head
  const headAngle = Math.atan2(ctrl1Y - head.y, ctrl1X - head.x) * (180 / Math.PI);

  return (
    <g className="snake-item" opacity="0.95">
      {/* Snake body outer */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#snake-grad)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Snake body inner belly line */}
      <path
        d={pathD}
        fill="none"
        stroke="#fef08a"
        strokeWidth="3.5"
        strokeDasharray="8 6"
        strokeLinecap="round"
      />

      {/* Snake Head at start tile */}
      <g transform={`translate(${head.x}, ${head.y}) rotate(${headAngle - 90})`}>
        {/* Forked tongue */}
        <path
          d="M 0 -10 L 0 -18 M -3 -23 L 0 -18 L 3 -23"
          stroke="#f43f5e"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Head oval */}
        <ellipse cx="0" cy="0" rx="10" ry="13" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />

        {/* Eyes */}
        <circle cx="-4" cy="-3" r="3" fill="#ffffff" />
        <circle cx="4" cy="-3" r="3" fill="#ffffff" />
        <circle cx="-4" cy="-4" r="1.5" fill="#000000" />
        <circle cx="4" cy="-4" r="1.5" fill="#000000" />
      </g>

      {/* Snake Tail at end tile */}
      <circle cx={tail.x} cy={tail.y} r="5" fill="#fb923c" stroke="#ffffff" strokeWidth="1.5" />
    </g>
  );
};
