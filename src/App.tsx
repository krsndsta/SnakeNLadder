import React from 'react';
import { PlayerSetup } from './components/PlayerSetup/PlayerSetup.tsx';
import { Board } from './components/Board/Board.tsx';
import { PlayerBar } from './components/PlayerBar/PlayerBar.tsx';
import { Dice } from './components/Dice/Dice.tsx';
import { QuestionModal } from './components/Cards/QuestionModal.tsx';
import { WinnerModal } from './components/WinnerModal/WinnerModal.tsx';
import { useGameEngine } from './hooks/useGameEngine.ts';
import './App.css';

export const App: React.FC = () => {
  const {
    players,
    activePlayer,
    diceValue,
    isRolling,
    isMoving,
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
  } = useGameEngine();

  return (
    <div className="app-container">
      {/* Header */}
      <header className="game-header">
        <div className="brand-wrapper">
          <div className="brand-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8" cy="8" r="1.5" fill="#fff" />
              <circle cx="16" cy="16" r="1.5" fill="#fff" />
              <circle cx="12" cy="12" r="1.5" fill="#fff" />
            </svg>
          </div>
          <h1 className="brand-title">Tongkrongan 100</h1>
        </div>

        <p className="game-subtitle">Party Snakes &amp; Ladders — 100 Steps of Fun &amp; Chaos</p>

        <div className="badge-row">
          <span className="badge highlight">🎮 2–4 Local Players</span>
          <span className="badge">📱 Single Device</span>
          <span className="badge">🎯 100 Serpentine Cells</span>
          <span className="badge">🪜 8 Tangga &amp; 8 Ular 🐍</span>
          <span className="badge">🃏 Kartu Tongkrongan</span>
          <span className="badge">👑 Ujian Juara 100</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="game-main">
        {status === 'setup' ? (
          <section className="setup-section">
            <PlayerSetup onStartGame={startGame} />
          </section>
        ) : (
          <section className="playing-section">
            <PlayerBar
              players={players}
              activePlayerId={activePlayer?.id}
              onResetSetup={resetGame}
            />

            <Dice
              diceValue={diceValue}
              isRolling={isRolling}
              isMoving={isMoving}
              activePlayer={activePlayer}
              winner={winner}
              statusMessage={statusMessage}
              onRoll={rollAndMove}
              onResetGame={resetGame}
            />

            <div className="board-wrapper">
              <Board
                players={players}
                activePlayerId={activePlayer?.id}
              />
            </div>
          </section>
        )}
      </main>

      {/* Question Card Modal */}
      <QuestionModal
        card={currentCard}
        targetPlayer={activePlayer}
        onDismiss={dismissCard}
      />

      {/* Winner Climax Modal */}
      <WinnerModal
        winner={winner}
        finalQuestion={finalQuestion}
        onPlayAgainSamePlayers={playAgainSamePlayers}
        onResetToSetup={resetGame}
      />

      {/* Footer */}
      <footer className="game-footer">
        <p><strong>Tongkrongan 100</strong> • Built with React, TypeScript &amp; Vite</p>
        <p>No backend • Zero external tracking • 100% Client-Side Local Party Game</p>
      </footer>
    </div>
  );
};

export default App;
