import { getPortalAtCell, type BoardPortal } from '../data/boardConfig.ts';

export interface NextPositionResult {
  targetPosition: number;
  canMove: boolean;
  isExactWinner: boolean;
  isOvershoot: boolean;
}

export interface PortalResolutionResult {
  hasPortal: boolean;
  portal?: BoardPortal;
  finalPosition: number;
  isExactWinner: boolean;
}

/**
 * Generates a random dice roll between 1 and 6 (inclusive).
 */
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Calculates the destination position given current position (0-100) and dice roll (1-6).
 * Movement Rules:
 * - Winning tile is exactly 100.
 * - If currentPosition + roll === 100: reaches finish, player wins.
 * - If currentPosition + roll > 100: overshoot! Player remains at current position.
 * - If currentPosition + roll < 100: advances normally.
 */
export function calculateNextPosition(currentPosition: number, roll: number): NextPositionResult {
  const potential = currentPosition + roll;

  if (potential === 100) {
    return {
      targetPosition: 100,
      canMove: true,
      isExactWinner: true,
      isOvershoot: false,
    };
  }

  if (potential > 100) {
    return {
      targetPosition: currentPosition,
      canMove: false,
      isExactWinner: false,
      isOvershoot: true,
    };
  }

  return {
    targetPosition: potential,
    canMove: true,
    isExactWinner: false,
    isOvershoot: false,
  };
}

/**
 * Checks if landing on a cell triggers a snake or a ladder.
 */
export function checkPortalResolution(cellNumber: number): PortalResolutionResult {
  const portal = getPortalAtCell(cellNumber);
  if (!portal) {
    return {
      hasPortal: false,
      finalPosition: cellNumber,
      isExactWinner: cellNumber === 100,
    };
  }

  return {
    hasPortal: true,
    portal,
    finalPosition: portal.to,
    isExactWinner: portal.to === 100,
  };
}

/**
 * Computes the index of the next player in round-robin turn order.
 */
export function getNextPlayerIndex(currentIndex: number, totalPlayers: number): number {
  if (totalPlayers <= 0) return 0;
  return (currentIndex + 1) % totalPlayers;
}
