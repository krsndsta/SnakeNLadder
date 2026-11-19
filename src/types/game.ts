import type { QuestionCard } from '../data/questions.ts';

export type PlayerColor = 'coral' | 'teal' | 'amber' | 'violet';

export interface PlayerColorMeta {
  color: PlayerColor;
  label: string;
  hex: string;
  accentBg: string;
}

export const PLAYER_COLORS: Record<PlayerColor, PlayerColorMeta> = {
  coral: {
    color: 'coral',
    label: 'Coral Red',
    hex: '#f43f5e',
    accentBg: 'rgba(244, 63, 94, 0.15)',
  },
  teal: {
    color: 'teal',
    label: 'Teal Blue',
    hex: '#06b6d4',
    accentBg: 'rgba(6, 182, 212, 0.15)',
  },
  amber: {
    color: 'amber',
    label: 'Amber Gold',
    hex: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.15)',
  },
  violet: {
    color: 'violet',
    label: 'Electric Violet',
    hex: '#8b5cf6',
    accentBg: 'rgba(139, 92, 246, 0.15)',
  },
};

export const COLOR_ORDER: PlayerColor[] = ['coral', 'teal', 'amber', 'violet'];

export interface Player {
  id: number;
  name: string;
  color: PlayerColor;
  position: number; // 0 = start base (outside board), 1 to 100 = on board
  isWinner?: boolean;
}

export type GameStatus = 'setup' | 'playing' | 'question_modal' | 'game_over';

export interface GameState {
  players: Player[];
  activePlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  isMoving: boolean;
  currentCard: QuestionCard | null;
  winner: Player | null;
  status: GameStatus;
  statusMessage: string;
}
