import { useState } from "react";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

//test

export default function GameBoard() {
  const [gameBoard, setGameBoard] = useState(initialGameBoard);

  function handleClick(rowIdx, colIdx, symbol) {
    setGameBoard((prevGameBoard) => {
      const gameBoard = [...prevGameBoard.map((row) => [...row])];
      gameBoard[rowIdx][colIdx] = symbol;
      return gameBoard;
    });
  }

  return (
    <ol id="game-board">
      {gameBoard.map((row, rowIdx) => (
        <li key={rowIdx}>
          <ol>
            {row.map((symbol, colIdx) => (
              <li key={colIdx}>
                <button
                  onClick={() => {
                    handleClick(rowIdx, colIdx, "X");
                  }}
                >
                  {symbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
