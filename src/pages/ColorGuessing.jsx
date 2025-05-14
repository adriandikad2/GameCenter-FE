import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Yellow', hex: '#fde047' },
  { name: 'Purple', hex: '#a78bfa' },
  { name: 'Orange', hex: '#fb923c' },
  { name: 'Pink', hex: '#f472b6' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Brown', hex: '#92400e' },
  { name: 'Gray', hex: '#6b7280' },
];

const MAX_ROUNDS = 20;

function getRandomColors(count) {
  const shuffled = COLORS.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const ColorGuessingGame = () => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [options, setOptions] = useState([]);
  const [target, setTarget] = useState(null);
  const [selected, setSelected] = useState([]); // indexes of wrong guesses
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (!gameOver && !win) {
      startRound(round);
    }
    // eslint-disable-next-line
  }, [round, gameOver, win]);

  const startRound = (r) => {
    const optionCount = Math.min(3 + Math.floor((r - 1) / 3), 9);
    const opts = getRandomColors(optionCount);
    const tgt = opts[Math.floor(Math.random() * opts.length)];
    setOptions(opts);
    setTarget(tgt);
    setSelected([]);
  };

  const handleGuess = (idx) => {
    if (gameOver || win || selected.includes(idx)) return;
    if (options[idx].name === target.name) {
      setScore((s) => s + 1);
      if (round === MAX_ROUNDS) {
        setWin(true);
        setGameOver(true);
      } else {
        setTimeout(() => setRound((r) => r + 1), 600);
      }
    } else {
      setMistakes((m) => m + 1);
      setSelected((sel) => [...sel, idx]);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setMistakes(0);
    setGameOver(false);
    setWin(false);
    setSelected([]);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-blue-100 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">Color Guess</h1>
          <p className="mb-2 text-lg">Match the color with the correct option! Options increase as you progress.</p>
          <div className="mb-2 text-lg font-semibold">Round: {round} / {MAX_ROUNDS}</div>
          <div className="mb-2 text-lg">Score: {score} | Mistakes: {mistakes}</div>
          <div className="w-32 h-32 rounded-lg mb-6 border-4 border-gray-300 shadow-lg" style={{ background: target ? target.hex : '#fff' }} />
          <div
            className={`mb-6 grid gap-4 ${
              options.length <= 2
                ? 'grid-cols-1'
                : options.length <= 4
                ? 'grid-cols-2'
                : 'grid-cols-3'
            }`}
          >
            {options.map((opt, idx) => (
              <button
                key={opt.name}
                onClick={() => handleGuess(idx)}
                className={`flex items-center justify-center rounded-lg shadow border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400
                  h-16 w-full min-w-[80px] max-w-[140px] mx-auto
                  ${
                    selected.includes(idx)
                      ? 'opacity-40 border-gray-400 cursor-not-allowed'
                      : 'hover:scale-105 border-indigo-300 cursor-pointer'
                  }
                `}
                style={{ background: opt.hex }}
                aria-label={opt.name}
                disabled={selected.includes(idx) || gameOver || win}
              >
                <span className="sr-only">{opt.name}</span>
              </button>
            ))}
          </div>
          {(gameOver || win) && (
            <>
              <div className={`font-bold mb-4 ${win ? 'text-green-600' : 'text-red-600'}`}>
                {win ? `Congratulations! You won all ${MAX_ROUNDS} rounds!` : `Game Over!`}
              </div>
              <div className="mb-2">Final Score: {score} / {MAX_ROUNDS}</div>
              <div className="mb-4">Total Mistakes: {mistakes}</div>
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium shadow hover:bg-indigo-700"
              >
                Play Again
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ColorGuessingGame;
