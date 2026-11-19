export interface BoardPortal {
  id: string;
  from: number; // Starting cell (trigger)
  to: number;   // Destination cell
  type: 'snake' | 'ladder';
}

/**
 * Standard balanced set of Snakes and Ladders for 100-cell board.
 * - Ladders: from < to (boosts player forward)
 * - Snakes: from > to (drops player backward)
 * No loops or chained landings.
 */
export const BOARD_PORTALS: BoardPortal[] = [
  // Ladders
  { id: 'ladder-1', type: 'ladder', from: 4, to: 14 },
  { id: 'ladder-2', type: 'ladder', from: 9, to: 31 },
  { id: 'ladder-3', type: 'ladder', from: 20, to: 38 },
  { id: 'ladder-4', type: 'ladder', from: 28, to: 84 },
  { id: 'ladder-5', type: 'ladder', from: 40, to: 59 },
  { id: 'ladder-6', type: 'ladder', from: 51, to: 67 },
  { id: 'ladder-7', type: 'ladder', from: 63, to: 81 },
  { id: 'ladder-8', type: 'ladder', from: 71, to: 91 },

  // Snakes
  { id: 'snake-1', type: 'snake', from: 17, to: 7 },
  { id: 'snake-2', type: 'snake', from: 54, to: 34 },
  { id: 'snake-3', type: 'snake', from: 62, to: 19 },
  { id: 'snake-4', type: 'snake', from: 64, to: 60 },
  { id: 'snake-5', type: 'snake', from: 87, to: 24 },
  { id: 'snake-6', type: 'snake', from: 93, to: 73 },
  { id: 'snake-7', type: 'snake', from: 95, to: 75 },
  { id: 'snake-8', type: 'snake', from: 98, to: 79 },
];

export const PORTALS_BY_START = new Map<number, BoardPortal>(
  BOARD_PORTALS.map((p) => [p.from, p])
);

/**
 * Selected special cells that trigger random Party Question Cards (Kartu Tongkrongan).
 * Distributed cleanly across the board, strictly non-overlapping with snake/ladder triggers, start, or finish.
 */
export const QUESTION_CELLS: number[] = [8, 15, 25, 33, 45, 52, 66, 76, 83, 89, 92, 97];
export const QUESTION_CELLS_SET = new Set<number>(QUESTION_CELLS);

/**
 * Checks whether a cell triggers a snake or a ladder.
 */
export function getPortalAtCell(cellNumber: number): BoardPortal | undefined {
  return PORTALS_BY_START.get(cellNumber);
}

/**
 * Checks whether a cell triggers a Question Card.
 */
export function isQuestionCell(cellNumber: number): boolean {
  return QUESTION_CELLS_SET.has(cellNumber);
}
