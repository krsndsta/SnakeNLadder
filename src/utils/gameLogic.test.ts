import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  rollDice,
  calculateNextPosition,
  checkPortalResolution,
  getNextPlayerIndex,
} from './gameLogic.ts';
import {
  BOARD_PORTALS,
  getPortalAtCell,
  QUESTION_CELLS,
  isQuestionCell,
} from '../data/boardConfig.ts';
import {
  PARTY_QUESTIONS,
  FINAL_SHOWDOWN_QUESTIONS,
  getRandomQuestion,
  getRandomFinalQuestion,
  type QuestionCard,
} from '../data/questions.ts';

describe('gameLogic - dice and movement rules', () => {
  test('rollDice generates integer values between 1 and 6', () => {
    for (let i = 0; i < 100; i++) {
      const roll = rollDice();
      assert.ok(Number.isInteger(roll), 'Roll should be integer');
      assert.ok(roll >= 1 && roll <= 6, `Roll ${roll} should be between 1 and 6`);
    }
  });

  test('starting at position 0 moves onto the board correctly', () => {
    for (let roll = 1; roll <= 6; roll++) {
      const res = calculateNextPosition(0, roll);
      assert.strictEqual(res.canMove, true);
      assert.strictEqual(res.targetPosition, roll);
      assert.strictEqual(res.isExactWinner, false);
      assert.strictEqual(res.isOvershoot, false);
    }
  });

  test('position 1 moves according to dice', () => {
    const res = calculateNextPosition(1, 4);
    assert.strictEqual(res.canMove, true);
    assert.strictEqual(res.targetPosition, 5);
    assert.strictEqual(res.isExactWinner, false);
    assert.strictEqual(res.isOvershoot, false);
  });

  test('position 99: roll of 1 reaches exact 100 and wins', () => {
    const res = calculateNextPosition(99, 1);
    assert.strictEqual(res.canMove, true);
    assert.strictEqual(res.targetPosition, 100);
    assert.strictEqual(res.isExactWinner, true);
    assert.strictEqual(res.isOvershoot, false);
  });

  test('position 99: roll of 2..6 overshoots and leaves player in place at 99', () => {
    for (let roll = 2; roll <= 6; roll++) {
      const res = calculateNextPosition(99, roll);
      assert.strictEqual(res.canMove, false);
      assert.strictEqual(res.targetPosition, 99);
      assert.strictEqual(res.isExactWinner, false);
      assert.strictEqual(res.isOvershoot, true);
    }
  });

  test('position 95: roll of 5 lands on exactly 100 and wins', () => {
    const res = calculateNextPosition(95, 5);
    assert.strictEqual(res.canMove, true);
    assert.strictEqual(res.targetPosition, 100);
    assert.strictEqual(res.isExactWinner, true);
    assert.strictEqual(res.isOvershoot, false);
  });

  test('position 95: roll of 6 overshoots to 101, remains at 95', () => {
    const res = calculateNextPosition(95, 6);
    assert.strictEqual(res.canMove, false);
    assert.strictEqual(res.targetPosition, 95);
    assert.strictEqual(res.isExactWinner, false);
    assert.strictEqual(res.isOvershoot, true);
  });

  test('round robin turn rotation for 2 players', () => {
    assert.strictEqual(getNextPlayerIndex(0, 2), 1);
    assert.strictEqual(getNextPlayerIndex(1, 2), 0);
  });

  test('round robin turn rotation for 3 players', () => {
    assert.strictEqual(getNextPlayerIndex(0, 3), 1);
    assert.strictEqual(getNextPlayerIndex(1, 3), 2);
    assert.strictEqual(getNextPlayerIndex(2, 3), 0);
  });

  test('round robin turn rotation for 4 players', () => {
    assert.strictEqual(getNextPlayerIndex(0, 4), 1);
    assert.strictEqual(getNextPlayerIndex(1, 4), 2);
    assert.strictEqual(getNextPlayerIndex(2, 4), 3);
    assert.strictEqual(getNextPlayerIndex(3, 4), 0);
  });
});

describe('boardConfig - snakes, ladders and question cells integrity', () => {
  test('all ladders boost players forward (from < to)', () => {
    const ladders = BOARD_PORTALS.filter((p) => p.type === 'ladder');
    assert.ok(ladders.length > 0, 'Should have ladders configured');
    for (const l of ladders) {
      assert.ok(l.from < l.to, `Ladder from ${l.from} should be less than ${l.to}`);
      assert.ok(l.from >= 1 && l.to <= 100, `Ladder bounds valid for ${l.id}`);
    }
  });

  test('all snakes drop players backward (from > to)', () => {
    const snakes = BOARD_PORTALS.filter((p) => p.type === 'snake');
    assert.ok(snakes.length > 0, 'Should have snakes configured');
    for (const s of snakes) {
      assert.ok(s.from > s.to, `Snake from ${s.from} should be greater than ${s.to}`);
      assert.ok(s.from < 100 && s.to >= 1, `Snake bounds valid for ${s.id}`);
    }
  });

  test('no portal destination lands directly on another portal trigger (no infinite loops)', () => {
    for (const portal of BOARD_PORTALS) {
      const chained = getPortalAtCell(portal.to);
      assert.strictEqual(
        chained,
        undefined,
        `Portal ${portal.id} lands on ${portal.to} which triggers another portal`
      );
    }
  });

  test('checkPortalResolution identifies snakes, ladders, and regular cells', () => {
    // Ladder at 4 -> 14
    const ladderRes = checkPortalResolution(4);
    assert.strictEqual(ladderRes.hasPortal, true);
    assert.strictEqual(ladderRes.portal?.type, 'ladder');
    assert.strictEqual(ladderRes.finalPosition, 14);

    // Snake at 98 -> 79
    const snakeRes = checkPortalResolution(98);
    assert.strictEqual(snakeRes.hasPortal, true);
    assert.strictEqual(snakeRes.portal?.type, 'snake');
    assert.strictEqual(snakeRes.finalPosition, 79);

    // Regular cell at 10
    const regularRes = checkPortalResolution(10);
    assert.strictEqual(regularRes.hasPortal, false);
    assert.strictEqual(regularRes.finalPosition, 10);
  });

  test('question cells are valid, strictly non-overlapping with portals, start, and finish', () => {
    assert.ok(QUESTION_CELLS.length > 0, 'Should have question cells configured');

    for (const cell of QUESTION_CELLS) {
      assert.ok(cell > 1 && cell < 100, `Question cell ${cell} must be between 2 and 99`);
      assert.strictEqual(
        getPortalAtCell(cell),
        undefined,
        `Question cell ${cell} must not trigger a snake or ladder`
      );
      assert.strictEqual(isQuestionCell(cell), true);
    }

    assert.strictEqual(isQuestionCell(1), false);
    assert.strictEqual(isQuestionCell(100), false);
  });
});

describe('questions - party deck integrity and drawing', () => {
  test('all questions have valid id, title, category, and prompt', () => {
    assert.ok(PARTY_QUESTIONS.length >= 20, 'Should have at least 20 question cards');
    const ids = new Set<string>();

    for (const q of PARTY_QUESTIONS) {
      assert.ok(q.id && typeof q.id === 'string', 'ID must be non-empty string');
      assert.ok(!ids.has(q.id), `Duplicate question id found: ${q.id}`);
      ids.add(q.id);

      assert.ok(['truth', 'dare', 'trivia', 'wild'].includes(q.category));
      assert.ok(q.title && q.title.length > 0, 'Question must have title');
      assert.ok(q.prompt && q.prompt.length > 0, 'Question must have prompt');
    }
  });

  test('getRandomQuestion returns valid card and respects exclusion list', () => {
    const card1: QuestionCard = getRandomQuestion();
    assert.ok(card1 && card1.id);

    // Exclude card1 id
    for (let i = 0; i < 20; i++) {
      const card2 = getRandomQuestion([card1.id]);
      assert.notStrictEqual(card2.id, card1.id, 'Should not return excluded card');
    }
  });

  test('final showdown questions are defined and getRandomFinalQuestion returns a challenge', () => {
    assert.ok(FINAL_SHOWDOWN_QUESTIONS.length >= 3, 'Must have at least 3 showdown cards');
    for (const q of FINAL_SHOWDOWN_QUESTIONS) {
      assert.ok(q.id && q.id.startsWith('final-'), 'Showdown cards must have final- prefix');
      assert.ok(q.title && q.title.length > 0);
      assert.ok(q.prompt && q.prompt.length > 0);
    }

    const drawnFinal = getRandomFinalQuestion();
    assert.ok(drawnFinal && drawnFinal.id.startsWith('final-'));
  });
});
