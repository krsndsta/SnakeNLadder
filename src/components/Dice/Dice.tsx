import React from 'react';
import { type Player, PLAYER_COLORS } from '../../types/game';
import './Dice.css';

interface DiceProps {
  diceValue: number | null;
  isRolling: boolean;
  isMoving: boolean;
  activePlayer: Player | undefined;
  winner: Player | null;
  statusMessage: string;
  onRoll: () => void;
  onResetGame: () => void;
}

export const Dice: React.FC<DiceProps> = ({
  diceValue,
  isRolling,
  isMoving,
  activePlayer,
  winner,
  statusMessage,
  onRoll,
  onResetGame,
}) => {
  const isActionDisabled = isRolling || isMoving || winner !== null || !activePlayer;
  const activeColorMeta = activePlayer ? PLAYER_COLORS[activePlayer.color] : null;

  // Render dice pips based on value (1-6)
  const renderPips = (val: number | null) => {
    if (val === null) {
      return <div className="dice-face-placeholder">🎲</div>;
    }

    // Grid coordinates (row / col: 1 to 3)
    const pipCoordinates: Record<number, Array<[number, number]>> = {
      1: [[2, 2]],
      2: [[1, 1], [3, 3]],
      3: [[1, 1], [2, 2], [3, 3]],
      4: [[1, 1], [1, 3], [3, 1], [3, 3]],
      5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
      6: [[1, 1], [1, 3], [2, 1], [2, 3], [3, 1], [3, 3]],
    };

    const coords = pipCoordinates[val] || [];

    return coords.map(([r, c], idx) => (
      <span
        key={idx}
        className="pip"
        style={{
          gridRow: r,
          gridColumn: c,
        }}
      />
    ));
  };

  return (
    <div className="dice-control-panel">
      {/* Winner Celebration Banner */}
      {winner ? (
        <div className="winner-card">
          <span className="winner-title">👑 PEMENANG: {winner.name}!</span>
          <p className="winner-subtitle">
            Berhasil menyelesaikan petualangan hingga Petak 100!
          </p>
          <button type="button" className="play-again-btn" onClick={onResetGame}>
            🔄 Main Lagi (Setup Ulang)
          </button>
        </div>
      ) : (
        /* Turn Indicator */
        <div className="turn-banner">
          <div className="active-player-badge">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GILIRAN:</span>
            {activePlayer && activeColorMeta && (
              <span
                className="active-player-pill"
                style={{
                  color: activeColorMeta.hex,
                  backgroundColor: activeColorMeta.accentBg,
                  borderColor: activeColorMeta.hex,
                }}
              >
                <span className="active-player-dot" />
                {activePlayer.name}
              </span>
            )}
          </div>

          <span className="active-player-pos">
            Posisi Saat Ini:{' '}
            <strong>
              {activePlayer?.position === 0 ? 'Pangkalan (0)' : `Petak ${activePlayer?.position}`}
            </strong>
          </span>
        </div>
      )}

      {/* Interactive Dice Cube & Roll Button */}
      <div className="dice-stage">
        <div
          className={`dice-cube ${isRolling ? 'rolling' : ''}`}
          title={diceValue ? `Nilai Dadu: ${diceValue}` : 'Dadu Siap Dikocok'}
        >
          {renderPips(diceValue)}
        </div>

        <button
          type="button"
          className="roll-action-btn"
          disabled={isActionDisabled}
          onClick={onRoll}
          style={{
            backgroundColor: activeColorMeta ? activeColorMeta.hex : 'var(--accent-gold)',
          }}
        >
          <span>
            {isRolling
              ? 'Mengocok Dadu...'
              : isMoving
              ? 'Sedang Bergerak...'
              : 'Kocok Dadu 🎲'}
          </span>
        </button>
      </div>

      {/* Dynamic Status Message */}
      <div className="turn-status-message" aria-live="polite">
        {statusMessage}
      </div>
    </div>
  );
};
