import React, { useMemo } from 'react';
import { type Player, PLAYER_COLORS } from '../../types/game';
import { getBoardGrid, type BoardCellInfo } from '../../utils/boardCoordinates.ts';
import { getPortalAtCell, isQuestionCell } from '../../data/boardConfig.ts';
import { BoardOverlay } from './BoardOverlay.tsx';
import './Board.css';

interface BoardProps {
  players: Player[];
  activePlayerId?: number;
}

export const Board: React.FC<BoardProps> = ({ players, activePlayerId }) => {
  // 100 cells ordered row 0 to 9, col 0 to 9
  const gridCells: BoardCellInfo[] = useMemo(() => getBoardGrid(), []);

  // Map cellNumber -> players on that cell (cells 1 to 100)
  const playersByCell = useMemo(() => {
    const map = new Map<number, Player[]>();
    players.forEach((player) => {
      if (player.position >= 1 && player.position <= 100) {
        const list = map.get(player.position) || [];
        list.push(player);
        map.set(player.position, list);
      }
    });
    return map;
  }, [players]);

  // Players currently at position 0 (outside the board)
  const playersAtBase = useMemo(() => {
    return players.filter((p) => p.position === 0);
  }, [players]);

  return (
    <div className="board-wrapper-outer">
      <div className="board-container" aria-label="Papan Permainan 100 Petak">
        {/* SVG Snakes and Ladders illustrations overlay */}
        <BoardOverlay />

        {/* 10x10 Serpentine Grid */}
        <div className="board-grid">
          {gridCells.map((cell) => {
            const playersOnCell = playersByCell.get(cell.cellNumber) || [];
            const isStart = cell.cellNumber === 1;
            const isFinish = cell.cellNumber === 100;
            const isEvenPattern = (cell.row + cell.col) % 2 === 0;
            const portal = getPortalAtCell(cell.cellNumber);
            const isQuestion = isQuestionCell(cell.cellNumber);

            return (
              <div
                key={cell.cellNumber}
                className={`board-cell ${
                  isStart
                    ? 'cell-start'
                    : isFinish
                    ? 'cell-finish'
                    : isQuestion
                    ? 'cell-question'
                    : isEvenPattern
                    ? 'alt-even'
                    : 'alt-odd'
                }`}
                title={`Petak ${cell.cellNumber}${
                  portal
                    ? portal.type === 'ladder'
                      ? ` - Tangga ke petak ${portal.to}`
                      : ` - Ular ke petak ${portal.to}`
                    : isQuestion
                    ? ' - Petak Kartu Tongkrongan 🃏'
                    : ''
                }`}
              >
                <span className="cell-number">{cell.cellNumber}</span>

                {isStart && <span className="cell-badge-icon" title="Mulai (Petak 1)">🏁</span>}
                {isFinish && <span className="cell-badge-icon" title="Garis Akhir (Petak 100)">👑</span>}

                {/* Portal badge if this cell is a ladder start or snake head */}
                {portal && (
                  <span
                    className={`cell-portal-badge ${portal.type}`}
                    title={
                      portal.type === 'ladder'
                        ? `Tangga naik ke ${portal.to}`
                        : `Ular meluncur ke ${portal.to}`
                    }
                  >
                    {portal.type === 'ladder' ? `🪜 ${portal.to}` : `🐍 ${portal.to}`}
                  </span>
                )}

                {/* Question badge on designated question cells */}
                {!portal && isQuestion && (
                  <span
                    className="cell-portal-badge question"
                    title="Petak Kartu Tongkrongan"
                  >
                    🃏
                  </span>
                )}

                {/* Player tokens on this cell */}
                {playersOnCell.length > 0 && (
                  <div className="cell-tokens-cluster">
                    {playersOnCell.map((p) => {
                      const colorMeta = PLAYER_COLORS[p.color];
                      const isActive = p.id === activePlayerId;

                      return (
                        <div
                          key={p.id}
                          className={`player-token ${isActive ? 'active-turn' : ''}`}
                          style={{
                            backgroundColor: colorMeta.hex,
                            outline: isActive ? '2px solid #ffffff' : 'none',
                          }}
                          title={`${p.name} (Petak ${p.position})`}
                        >
                          {p.id}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Base Area outside the numbered board (Position 0) */}
      <div className="start-base-bar">
        <div className="start-base-label">
          <span>🚀</span>
          <span>Pangkalan Mulai (Petak 0):</span>
        </div>

        <div className="start-base-tokens">
          {playersAtBase.length > 0 ? (
            playersAtBase.map((p) => {
              const colorMeta = PLAYER_COLORS[p.color];
              const isActive = p.id === activePlayerId;

              return (
                <div
                  key={p.id}
                  className={`player-token ${isActive ? 'active-turn' : ''}`}
                  style={{
                    backgroundColor: colorMeta.hex,
                    outline: isActive ? '2px solid #ffffff' : 'none',
                  }}
                  title={`${p.name} (Menunggu di Pangkalan / Petak 0)`}
                >
                  {p.id}
                </div>
              );
            })
          ) : (
            <span className="start-base-empty">Semua pemain sudah memasuki lintasan!</span>
          )}
        </div>
      </div>
    </div>
  );
};
