import React, { useState } from 'react';
import type { Player } from '../../types/game.ts';
import { PLAYER_COLORS } from '../../types/game.ts';
import type { QuestionCard } from '../../data/questions.ts';
import './WinnerModal.css';

interface WinnerModalProps {
  winner: Player | null;
  finalQuestion: QuestionCard | null;
  onPlayAgainSamePlayers: () => void;
  onResetToSetup: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  finalQuestion,
  onPlayAgainSamePlayers,
  onResetToSetup,
}) => {
  const [isChallengeConfirmed, setIsChallengeConfirmed] = useState<boolean>(false);

  if (!winner) return null;

  const playerColorMeta = PLAYER_COLORS[winner.color];

  // Confetti particles with diverse colors and positions
  const confettiColors = ['#f43f5e', '#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#fbbf24'];

  return (
    <div
      className="winner-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-dialog-title"
    >
      <div className="winner-modal-container">
        {/* CSS Confetti Rain Background */}
        <div className="confetti-rain" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="confetti-particle"
              style={{
                left: `${(i * 4.2) % 100}%`,
                backgroundColor: confettiColors[i % confettiColors.length],
                animationDelay: `${(i * 0.15) % 2.5}s`,
                animationDuration: `${2.5 + ((i * 0.2) % 1.5)}s`,
              }}
            />
          ))}
        </div>

        {/* Modal Inner */}
        <div className="winner-modal-inner">
          {/* Trophy Header */}
          <div className="winner-trophy-wrapper">
            <div className="winner-trophy-glow" />
            <span className="winner-trophy-icon">🏆</span>
          </div>

          <span className="winner-crown-label">Pemenang Petak 100</span>

          {/* Winner Name Banner */}
          <div
            className="winner-name-banner"
            style={{
              color: playerColorMeta.hex,
              backgroundColor: playerColorMeta.accentBg,
              borderColor: playerColorMeta.hex,
            }}
          >
            <span className="winner-avatar-dot" />
            <h2 id="winner-dialog-title" style={{ fontSize: '1.35rem', margin: 0, color: 'inherit' }}>
              {winner.name} Juara!
            </h2>
          </div>

          {/* Final Showdown Challenge Card */}
          {finalQuestion && (
            <div className="final-challenge-card">
              <span className="final-challenge-tag">
                <span>👑</span>
                <span>Ujian Pamungkas Sang Juara</span>
              </span>

              <h3 className="final-challenge-title">{finalQuestion.title}</h3>

              <div className="final-challenge-prompt">
                "{finalQuestion.prompt}"
              </div>

              {finalQuestion.penaltyOrReward && (
                <span className="final-challenge-note">
                  ⚡ {finalQuestion.penaltyOrReward}
                </span>
              )}
            </div>
          )}

          {/* Confirmed State Notice */}
          {isChallengeConfirmed && (
            <div className="challenge-confirmed-notice">
              <span>🎉</span>
              <span>Tantangan tuntas! {winner.name} resmi dinobatkan sebagai Juara Sejati!</span>
            </div>
          )}

          {/* Actions */}
          <div className="winner-actions-group">
            {!isChallengeConfirmed && (
              <button
                type="button"
                className="confirm-challenge-btn"
                onClick={() => setIsChallengeConfirmed(true)}
              >
                <span>Tantangan Selesai! Sah Jadi Juara 🎉</span>
              </button>
            )}

            <div className="play-again-options">
              <button
                type="button"
                className="btn-secondary"
                onClick={onPlayAgainSamePlayers}
              >
                <span>🔄 Main Lagi (Pemain Sama)</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={onResetToSetup}
              >
                <span>⚙️ Ganti Pemain</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
