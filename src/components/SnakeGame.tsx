import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange, isPaused }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const ns = s + 10;
          onScoreChange(ns);
          return ns;
        });
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, Math.max(50, 150 - score / 5));
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#010101';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines - Harsh and visible
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw Food - Flickering Pulse
    ctx.fillStyle = Math.random() > 0.8 ? '#ffffff' : '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );

    // Draw Snake - Raw blocks
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : '#00aab2';
      
      // Chromatic effect on head
      if (isHead) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00f3ff';
      } else {
          ctx.shadowBlur = 0;
      }
      
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

  }, [snake, food]);

  const resetGame = () => {
    if (score > highScore) setHighScore(score);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
  };

  return (
    <div className="relative">
      <div className="bg-black overflow-hidden border-2 border-white/20">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block max-w-full aspect-square"
        />
        
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-magenta-500 flex flex-col items-center justify-center text-black z-50 animate-tear"
            >
              <h2 className="text-8xl font-black uppercase italic tracking-tighter chromatic-aberration">FATAL_ERROR</h2>
              <div className="text-2xl font-mono mb-8 bg-black text-magenta-500 px-4 py-1">_SCR: {score} // SYSTEM_DUMPed</div>
              <button 
                onClick={resetGame}
                className="px-12 py-4 bg-black text-white hover:bg-white hover:text-black font-black text-2xl transition-invert tracking-[0.2em] border-4 border-black"
              >
                REINITIALIZE.BIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPaused && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center text-white pointer-events-none"
            >
              <div className="text-8xl font-black text-cyan-400 italic skew-x-[-15deg] glitch-text opacity-40">STBY_MD</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
