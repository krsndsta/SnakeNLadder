import React from 'react';
import type { QuestionCard } from '../../data/questions.ts';
import { QUESTION_CATEGORIES } from '../../data/questions.ts';
import type { Player } from '../../types/game.ts';
import { PLAYER_COLORS } from '../../types/game.ts';
import './QuestionModal.css';

interface QuestionModalProps {
  card: QuestionCard | null;
  targetPlayer?: Player;
  onDismiss: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  card,
  targetPlayer,
  onDismiss,
}) => {
  if (!card) return null;

  const categoryMeta = QUESTION_CATEGORIES[card.category];
  const playerColorMeta = targetPlayer ? PLAYER_COLORS[targetPlayer.color] : null;

  return (
    <div
      className="card-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-title"
    >
      <div
        className="card-modal-content"
        style={{
          borderColor: categoryMeta?.borderColor || 'var(--border-color)',
        }}
      >
        {/* Header */}
        <div className="card-modal-header">
          <span
            className="category-pill"
            style={{
              color: categoryMeta?.badgeColor || '#fff',
              backgroundColor: categoryMeta?.badgeBg || 'transparent',
              borderColor: categoryMeta?.borderColor || 'currentColor',
            }}
          >
            <span>{categoryMeta?.icon || '🃏'}</span>
            <span>{categoryMeta?.label || 'Kartu Tongkrongan'}</span>
          </span>

          {targetPlayer && playerColorMeta && (
            <span className="player-target-pill">
              <span
                className="player-target-dot"
                style={{ backgroundColor: playerColorMeta.hex, color: playerColorMeta.hex }}
              />
              <span>Giliran: {targetPlayer.name}</span>
            </span>
          )}
        </div>

        {/* Body */}
        <div className="card-modal-body">
          <h3 id="card-title" className="card-title">
            {card.title}
          </h3>

          <div className="card-prompt-box">
            "{card.prompt}"
          </div>

          {card.penaltyOrReward && (
            <div className="card-consequence-box">
              <span>⚡</span>
              <span>{card.penaltyOrReward}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="card-modal-footer">
          <button
            type="button"
            className="card-dismiss-btn"
            onClick={onDismiss}
            autoFocus
          >
            <span>Selesai &amp; Lanjut Giliran</span>
            <span>➡️</span>
          </button>
        </div>
      </div>
    </div>
  );
};
