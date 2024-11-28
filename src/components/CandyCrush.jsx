import React, { useState, useEffect } from 'react';
import './CandyCrush.css';
import redCandy from '../images/red.png';
import greenCandy from '../images/green.png';
import blueCandy from '../images/blue.png';
import yellowCandy from '../images/yellow.png';
import purpleCandy from '../images/purple.png';
import orangeCandy from '../images/orange.png';
import axios from 'axios';

const width = 8;
const candyColors = [redCandy, greenCandy, blueCandy, yellowCandy, purpleCandy, orangeCandy];

const CandyCrush = () => {
  const [currentCandyArrangement, setCurrentCandyArrangement] = useState([]);
  const [draggedCandy, setDraggedCandy] = useState(null);
  const [replacedCandy, setReplacedCandy] = useState(null);
  const [remainingMoves, setRemainingMoves] = useState(20);
  const [remainingTime, setRemainingTime] = useState(60);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    initializeBoard();
    fetchHighScore();
  }, []);

  const initializeBoard = () => {
    const randomCandyArrangement = Array.from({ length: width * width }, () =>
      candyColors[Math.floor(Math.random() * candyColors.length)]
    );
    setCurrentCandyArrangement(randomCandyArrangement);
    setCurrentScore(0);
  };

  useEffect(() => {
    if (remainingTime > 0 && remainingMoves > 0) {
      const countdown = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsGameOver(true);
      if (currentScore > highScore) {
        setHighScore(currentScore);
        saveHighScore(currentScore);
      }
    }
  }, [remainingTime, remainingMoves]);

  const fetchHighScore = async () => {
    try {
      const response = await axios.get('/api/highscore');
      setHighScore(response.data.highScore);
    } catch (error) {
      console.error('Failed to fetch high score:', error);
    }
  };

  const saveHighScore = async (score) => {
    try {
      await axios.post('/api/highscore', { score });
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  const findColumnMatchOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnGroup = [i, i + width, i + width * 2, i + width * 3];
      const chosenColor = currentCandyArrangement[i];

      if (columnGroup.every(square => currentCandyArrangement[square] === chosenColor)) {
        setCurrentCandyArrangement(prevArrangement => {
          const updatedArrangement = [...prevArrangement];
          columnGroup.forEach(square => (updatedArrangement[square] = ''));
          return updatedArrangement;
        });
        setCurrentScore(prev => prev + 4);
        return true;
      }
    }
  };

  const findRowMatchOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowGroup = [i, i + 1, i + 2, i + 3];
      const chosenColor = currentCandyArrangement[i];
      const invalidIndices = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63];

      if (invalidIndices.includes(i)) continue;

      if (rowGroup.every(square => currentCandyArrangement[square] === chosenColor)) {
        setCurrentCandyArrangement(prevArrangement => {
          const updatedArrangement = [...prevArrangement];
          rowGroup.forEach(square => (updatedArrangement[square] = ''));
          return updatedArrangement;
        });
        setCurrentScore(prev => prev + 4);
        return true;
      }
    }
  };

  const findColumnMatchOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnGroup = [i, i + width, i + width * 2];
      const chosenColor = currentCandyArrangement[i];

      if (columnGroup.every(square => currentCandyArrangement[square] === chosenColor)) {
        setCurrentCandyArrangement(prevArrangement => {
          const updatedArrangement = [...prevArrangement];
          columnGroup.forEach(square => (updatedArrangement[square] = ''));
          return updatedArrangement;
        });
        setCurrentScore(prev => prev + 3);
        return true;
      }
    }
  };

  const findRowMatchOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowGroup = [i, i + 1, i + 2];
      const chosenColor = currentCandyArrangement[i];
      const invalidIndices = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

      if (invalidIndices.includes(i)) continue;

      if (rowGroup.every(square => currentCandyArrangement[square] === chosenColor)) {
        setCurrentCandyArrangement(prevArrangement => {
          const updatedArrangement = [...prevArrangement];
          rowGroup.forEach(square => (updatedArrangement[square] = ''));
          return updatedArrangement;
        });
        setCurrentScore(prev => prev + 3);
        return true;
      }
    }
  };

  const fillEmptySpaces = () => {
    setCurrentCandyArrangement(prevArrangement => {
      const updatedArrangement = [...prevArrangement];
      for (let i = 0; i <= 55; i++) {
        const firstRowIndices = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRowIndices.includes(i);

        if (isFirstRow && updatedArrangement[i] === '') {
          let randomIndex = Math.floor(Math.random() * candyColors.length);
          updatedArrangement[i] = candyColors[randomIndex];
        }

        if (updatedArrangement[i + width] === '') {
          updatedArrangement[i + width] = updatedArrangement[i];
          updatedArrangement[i] = '';
        }
      }
      return updatedArrangement;
    });
  };

  const startDrag = (e) => {
    setDraggedCandy(e.target);
  };

  const dropCandy = (e) => {
    setReplacedCandy(e.target);
  };

  const endDrag = () => {
    const draggedCandyId = parseInt(draggedCandy.getAttribute('data-id'));
    const replacedCandyId = parseInt(replacedCandy.getAttribute('data-id'));

    const updatedArrangement = [...currentCandyArrangement];
    updatedArrangement[replacedCandyId] = draggedCandy.getAttribute('src');
    updatedArrangement[draggedCandyId] = replacedCandy.getAttribute('src');

    const validMoves = [
      draggedCandyId - 1,
      draggedCandyId - width,
      draggedCandyId + 1,
      draggedCandyId + width,
    ];

    const validMove = validMoves.includes(replacedCandyId);

    const hasColumnOfFour = findColumnMatchOfFour();
    const hasRowOfFour = findRowMatchOfFour();
    const hasColumnOfThree = findColumnMatchOfThree();
    const hasRowOfThree = findRowMatchOfThree();

    if (
      replacedCandyId &&
      validMove &&
      (hasRowOfThree || hasRowOfFour || hasColumnOfFour || hasColumnOfThree)
    ) {
      setDraggedCandy(null);
      setReplacedCandy(null);
      setRemainingMoves(prev => prev - 1);
      setCurrentCandyArrangement(updatedArrangement);
    } else {
      updatedArrangement[replacedCandyId] = replacedCandy.getAttribute('src');
      updatedArrangement[draggedCandyId] = draggedCandy.getAttribute('src');
      setCurrentCandyArrangement(updatedArrangement);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      findColumnMatchOfFour();
      findRowMatchOfFour();
      findColumnMatchOfThree();
      findRowMatchOfThree();
      fillEmptySpaces();
      setCurrentCandyArrangement(prev => [...prev]);
    }, 100);
    return () => clearInterval(timer);
  }, [currentCandyArrangement]);

  const resetGame = () => {
    setRemainingMoves(20);
    setRemainingTime(60);
    setCurrentScore(0);
    setIsGameOver(false);
    initializeBoard();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Sweet Crush Game</h1>
      </header>
      <div className="game-info">
        <div>Time Left: {remainingTime}s</div>
        <div>Moves Left: {remainingMoves}</div>
        <div>Score: {currentScore}</div>
        <div>High Score: {highScore}</div>
        {isGameOver && (
          <div className="game-over">
            <p>Game Over!</p>
            <button onClick={resetGame} className="restart-button">
              Play Again
            </button>
          </div>
        )}
      </div>
      <div className="game">
        {currentCandyArrangement.map((candy, index) => (
          <img
            key={index}
            src={candy}
            alt="candy"
            data-id={index}
            draggable={true}
            onDragStart={startDrag}
            onDragOver={(e) => e.preventDefault()}
            onDrop={dropCandy}
            onDragEnd={endDrag}
          />
        ))}
      </div>
    </div>
  );
};

export default CandyCrush;

