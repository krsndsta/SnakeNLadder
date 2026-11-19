import React from 'react';
import { type Player, PLAYER_COLORS } from '../../types/game';
import './PlayerBar.css';

interface PlayerBarProps {
  players: Player[];
  activePlayerId?: number;
  onResetSetup: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  players,
  activePlayerId,
  onResetSetup,
}) => {
  return (
    <div className="player-bar-container">
      <div className="player-cards-row">
        {players.map((player) => {
          const meta = PLAYER_COLORS[player.color];
          const isActive = player.id === activePlayerId;

          return (
            <div
              key={player.id}
              className="player-status-card"
              style={{
                borderColor: isActive ? meta.hex : 'var(--border-color)',
                backgroundColor: isActive ? meta.accentBg : 'var(--bg-surface)',
              }}
            >
              <div
                className="player-status-avatar"
                style={{
                  backgroundColor: meta.hex,
                }}
              >
                P{player.id}
              </div>
              <div className="player-status-info">
                <span className="player-status-name" title={player.name}>
                  {player.name}
                </span>
                <span className="player-status-position">
                  {player.position === 0 ? 'Pangkalan (0)' : `Petak ${player.position}`} / 100
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="player-bar-actions">
        <span className="player-bar-note">
          🎯 Mode Permainan 1 Perangkat • Pass &amp; Play
        </span>
        <button type="button" className="reset-setup-btn" onClick={onResetSetup}>
          ⚙️ Ganti Setup Pemain
        </button>
      </div>
    </div>
  );
};
