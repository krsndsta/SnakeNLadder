export interface GridCoordinate {
  row: number; // 0 to 9, where 0 is top row
  col: number; // 0 to 9, where 0 is leftmost column
}

export interface BoardCellInfo {
  cellNumber: number;
  row: number;
  col: number;
}

/**
 * Returns grid row and column (0-indexed from top-left) for a 1-based cell number (1 to 100).
 * Traditional serpentine path:
 * Cell 1 is at bottom-left (row 9, col 0)
 * Cell 10 is at bottom-right (row 9, col 9)
 * Cell 11 is right above cell 10 (row 8, col 9)
 * Cell 20 is at (row 8, col 0)
 * Cell 100 is at top-left (row 0, col 0)
 */
export function getCellCoordinates(cellNumber: number): GridCoordinate {
  const clamped = Math.max(1, Math.min(100, cellNumber));
  const idxFromBottom = clamped - 1;
  const rFromBottom = Math.floor(idxFromBottom / 10);
  const row = 9 - rFromBottom;

  const col =
    rFromBottom % 2 === 0
      ? idxFromBottom % 10
      : 9 - (idxFromBottom % 10);

  return { row, col };
}

/**
 * Returns cell number (1 to 100) from row and col (0-indexed from top-left).
 */
export function getCellNumber(row: number, col: number): number {
  const rFromBottom = 9 - row;
  const colOffset = rFromBottom % 2 === 0 ? col : 9 - col;
  return rFromBottom * 10 + colOffset + 1;
}

/**
 * Generates the full 100-cell grid in top-to-bottom, left-to-right display order (row 0 to 9, col 0 to 9).
 */
export function getBoardGrid(): BoardCellInfo[] {
  const cells: BoardCellInfo[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      cells.push({
        cellNumber: getCellNumber(r, c),
        row: r,
        col: c,
      });
    }
  }
  return cells;
}
