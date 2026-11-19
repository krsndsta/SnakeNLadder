import React, { useState } from 'react';
import { type Player, PLAYER_COLORS, COLOR_ORDER } from '../../types/game';
import './PlayerSetup.css';

interface PlayerSetupProps {
  onStartGame: (players: Player[]) => void;
  initialPlayerCount?: number;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  onStartGame,
  initialPlayerCount = 2,
}) => {
  const [playerCount, setPlayerCount] = useState<number>(initialPlayerCount);
  const [names, setNames] = useState<string[]>([
    'Pemain 1',
    'Pemain 2',
    'Pemain 3',
    'Pemain 4',
  ]);

  const handleNameChange = (index: number, newName: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = newName;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activePlayers: Player[] = Array.from({ length: playerCount }).map((_, index) => {
      const color = COLOR_ORDER[index];
      const trimmedName = names[index].trim();
      return {
        id: index + 1,
        name: trimmedName || `Pemain ${index + 1}`,
        color: color,
        position: 0, // Starts at base (outside board, position 0)
      };
    });

    onStartGame(activePlayers);
  };

  return (
    <div className="player-setup-card">
      <div className="setup-header">
        <span className="setup-badge">Lobby Permainan</span>
        <h2 className="setup-title">Setup Pemain</h2>
        <p className="setup-subtitle">
          Pilih jumlah pemain tongkrongan (2 sampai 4 pemain di 1 perangkat).
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Player Count Selection */}
        <div className="count-selector-group">
          <label className="count-label">Jumlah Pemain</label>
          <div className="count-options">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                className={`count-btn ${playerCount === count ? 'active' : ''}`}
                onClick={() => setPlayerCount(count)}
              >
                {count} Pemain
              </button>
            ))}
          </div>
        </div>

        {/* Player Name Fields */}
        <div className="player-list-form">
          {Array.from({ length: playerCount }).map((_, idx) => {
            const colorKey = COLOR_ORDER[idx];
            const meta = PLAYER_COLORS[colorKey];
            return (
              <div key={idx} className="player-input-row">
                <div
                  className="player-avatar-preview"
                  style={{
                    backgroundColor: meta.hex,
                    color: '#ffffff',
                  }}
                  title={meta.label}
                >
                  P{idx + 1}
                </div>
                <input
                  type="text"
                  className="player-text-input"
                  placeholder={`Nama Pemain ${idx + 1}`}
                  value={names[idx]}
                  maxLength={16}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  required
                />
                <span
                  className="player-color-pill"
                  style={{
                    color: meta.hex,
                    borderColor: meta.hex,
                    backgroundColor: meta.accentBg,
                  }}
                >
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>

        <button type="submit" className="start-game-btn">
          <span>Mulai Permainan</span>
          <span>🚀</span>
        </button>
      </form>
    </div>
  );
};
