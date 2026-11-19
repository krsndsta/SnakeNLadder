import { useState, useRef, useCallback, useEffect } from 'react';
import type { Player, GameStatus } from '../types/game.ts';
import type { QuestionCard } from '../data/questions.ts';
import { getRandomQuestion, getRandomFinalQuestion } from '../data/questions.ts';
import { isQuestionCell } from '../data/boardConfig.ts';
import {
  rollDice,
  calculateNextPosition,
  checkPortalResolution,
  getNextPlayerIndex,
} from '../utils/gameLogic.ts';

export interface UseGameEngineReturn {
  players: Player[];
  activePlayerIndex: number;
  activePlayer: Player | undefined;
  diceValue: number | null;
  isRolling: boolean;
  isMoving: boolean;
  isActionDisabled: boolean;
  currentCard: QuestionCard | null;
  finalQuestion: QuestionCard | null;
  winner: Player | null;
  status: GameStatus;
  statusMessage: string;
  startGame: (configuredPlayers: Player[]) => void;
  rollAndMove: () => void;
  dismissCard: () => void;
  playAgainSamePlayers: () => void;
  resetGame: () => void;
}

export function useGameEngine(): UseGameEngineReturn {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [currentCard, setCurrentCard] = useState<QuestionCard | null>(null);
  const [finalQuestion, setFinalQuestion] = useState<QuestionCard | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [status, setStatus] = useState<GameStatus>('setup');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const timersRef = useRef<number[]>([]);
  const recentCardIdsRef = useRef<string[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const activePlayer = players[activePlayerIndex];
  const isActionDisabled =
    isRolling ||
    isMoving ||
    winner !== null ||
    currentCard !== null ||
    status === 'question_modal' ||
    status === 'game_over' ||
    players.length === 0;

  const startGame = useCallback((configuredPlayers: Player[]) => {
    clearTimers();
    const initialized = configuredPlayers.map((p) => ({
      ...p,
      position: 0,
      isWinner: false,
    }));
    setPlayers(initialized);
    setActivePlayerIndex(0);
    setDiceValue(null);
    setIsRolling(false);
    setIsMoving(false);
    setCurrentCard(null);
    setFinalQuestion(null);
    setWinner(null);
    setStatus('playing');
    const firstPlayer = initialized[0];
    setStatusMessage(
      firstPlayer
        ? `Permainan dimulai! Giliran ${firstPlayer.name} untuk melempar dadu.`
        : 'Permainan siap.'
    );
  }, [clearTimers]);

  const playAgainSamePlayers = useCallback(() => {
    clearTimers();
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        position: 0,
        isWinner: false,
      }))
    );
    setActivePlayerIndex(0);
    setDiceValue(null);
    setIsRolling(false);
    setIsMoving(false);
    setCurrentCard(null);
    setFinalQuestion(null);
    setWinner(null);
    setStatus('playing');
    setStatusMessage(`Ronde baru dimulai! Giliran ${players[0]?.name || 'Pemain 1'} untuk melempar dadu.`);
  }, [players, clearTimers]);

  const resetGame = useCallback(() => {
    clearTimers();
    setPlayers([]);
    setActivePlayerIndex(0);
    setDiceValue(null);
    setIsRolling(false);
    setIsMoving(false);
    setCurrentCard(null);
    setFinalQuestion(null);
    setWinner(null);
    setStatus('setup');
    setStatusMessage('');
  }, [clearTimers]);

  const dismissCard = useCallback(() => {
    setCurrentCard(null);
    setStatus('playing');
    setActivePlayerIndex((prevIdx) => {
      const nextIdx = getNextPlayerIndex(prevIdx, players.length);
      const nextPlayer = players[nextIdx];
      if (nextPlayer) {
        setStatusMessage(`Tantangan selesai! Giliran ${nextPlayer.name}! Kocok dadu untuk jalan.`);
      }
      return nextIdx;
    });
  }, [players]);

  const rollAndMove = useCallback(() => {
    if (isActionDisabled || !activePlayer) return;

    clearTimers();
    setIsRolling(true);
    setStatusMessage(`${activePlayer.name} sedang melempar dadu...`);

    // Rolling animation simulation: 600ms
    const rollTimer = setTimeout(() => {
      const rolled = rollDice();
      setDiceValue(rolled);
      setIsRolling(false);

      const nextResult = calculateNextPosition(activePlayer.position, rolled);

      if (nextResult.isOvershoot) {
        setStatusMessage(
          `Dadu: ${rolled}. Melebihi petak 100! ${activePlayer.name} tetap di petak ${activePlayer.position}.`
        );

        // Allow players to read dice result before advancing turn
        const advanceTimer = setTimeout(() => {
          setActivePlayerIndex((prevIdx) => {
            const nextIdx = getNextPlayerIndex(prevIdx, players.length);
            const nextPlayer = players[nextIdx];
            if (nextPlayer) {
              setStatusMessage(`Giliran ${nextPlayer.name}! Kocok dadu untuk jalan.`);
            }
            return nextIdx;
          });
        }, 1200);

        timersRef.current.push(advanceTimer as unknown as number);
        return;
      }

      // Valid movement: Step-by-step token movement
      setIsMoving(true);
      setStatusMessage(`Dadu: ${rolled}. ${activePlayer.name} melangkah...`);

      const startPos = activePlayer.position;
      const targetPos = nextResult.targetPosition;
      const totalSteps = targetPos - startPos;
      const stepDurationMs = 220;

      let currentStep = 1;
      const stepInterval = setInterval(() => {
        const intermediatePos = startPos + currentStep;

        setPlayers((prevPlayers) =>
          prevPlayers.map((p) =>
            p.id === activePlayer.id ? { ...p, position: intermediatePos } : p
          )
        );

        if (currentStep >= totalSteps) {
          clearInterval(stepInterval);

          if (nextResult.isExactWinner) {
            // Player reached 100 directly!
            const winningPlayer: Player = {
              ...activePlayer,
              position: 100,
              isWinner: true,
            };
            const showdownCard = getRandomFinalQuestion();
            setFinalQuestion(showdownCard);
            setWinner(winningPlayer);
            setStatus('game_over');
            setIsMoving(false);
            setStatusMessage(
              `🎉 SELAMAT! ${winningPlayer.name} mencapai petak 100! Selesaikan Ujian Pamungkas Sang Juara untuk mengunci kemenangan!`
            );
          } else {
            // Check if landing tile has a Snake or Ladder
            const portalResult = checkPortalResolution(targetPos);
            if (portalResult.hasPortal && portalResult.portal) {
              const portal = portalResult.portal;
              const isLadder = portal.type === 'ladder';

              setStatusMessage(
                isLadder
                  ? `🪜 HORE! ${activePlayer.name} mendarat di tangga petak ${portal.from}! Bersiap naik ke petak ${portal.to}...`
                  : `🐍 AWAS! ${activePlayer.name} digigit ular di petak ${portal.from}! Bersiap merosot ke petak ${portal.to}...`
              );

              // Pause briefly to let players observe landing before sliding/climbing
              const portalTimer = setTimeout(() => {
                setPlayers((prevPlayers) =>
                  prevPlayers.map((p) =>
                    p.id === activePlayer.id ? { ...p, position: portal.to } : p
                  )
                );

                setStatusMessage(
                  isLadder
                    ? `🪜 ${activePlayer.name} melesat naik ke petak ${portal.to}!`
                    : `🐍 ${activePlayer.name} merosot turun ke petak ${portal.to}!`
                );

                // Delay before ending turn or triggering win
                const finishPortalTimer = setTimeout(() => {
                  setIsMoving(false);

                  if (portalResult.isExactWinner) {
                    const winningPlayer: Player = {
                      ...activePlayer,
                      position: 100,
                      isWinner: true,
                    };
                    const showdownCard = getRandomFinalQuestion();
                    setFinalQuestion(showdownCard);
                    setWinner(winningPlayer);
                    setStatus('game_over');
                    setStatusMessage(
                      `🎉 SELAMAT! ${winningPlayer.name} mencapai petak 100! Selesaikan Ujian Pamungkas Sang Juara!`
                    );
                  } else {
                    setActivePlayerIndex((prevIdx) => {
                      const nextIdx = getNextPlayerIndex(prevIdx, players.length);
                      const nextPlayer = players[nextIdx];
                      if (nextPlayer) {
                        setStatusMessage(`Giliran ${nextPlayer.name}! Kocok dadu untuk jalan.`);
                      }
                      return nextIdx;
                    });
                  }
                }, 850);

                timersRef.current.push(finishPortalTimer as unknown as number);
              }, 700);

              timersRef.current.push(portalTimer as unknown as number);
            } else if (isQuestionCell(targetPos)) {
              // Landing on a Question Cell!
              setIsMoving(false);
              const card = getRandomQuestion(recentCardIdsRef.current);
              recentCardIdsRef.current = [card.id, ...recentCardIdsRef.current.slice(0, 9)];
              setCurrentCard(card);
              setStatus('question_modal');
              setStatusMessage(
                `🃏 ${activePlayer.name} mendarat di petak kartu! Membuka tantangan...`
              );
            } else {
              // Normal tile, advance to next player
              setIsMoving(false);
              setActivePlayerIndex((prevIdx) => {
                const nextIdx = getNextPlayerIndex(prevIdx, players.length);
                const nextPlayer = players[nextIdx];
                if (nextPlayer) {
                  setStatusMessage(`Giliran ${nextPlayer.name}! Kocok dadu untuk jalan.`);
                }
                return nextIdx;
              });
            }
          }
        } else {
          currentStep += 1;
        }
      }, stepDurationMs);

      timersRef.current.push(stepInterval as unknown as number);
    }, 600);

    timersRef.current.push(rollTimer as unknown as number);
  }, [isActionDisabled, activePlayer, players, clearTimers]);

  return {
    players,
    activePlayerIndex,
    activePlayer,
    diceValue,
    isRolling,
    isMoving,
    isActionDisabled,
    currentCard,
    finalQuestion,
    winner,
    status,
    statusMessage,
    startGame,
    rollAndMove,
    dismissCard,
    playAgainSamePlayers,
    resetGame,
  };
}
