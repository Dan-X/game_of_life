import React, { useEffect, useState } from "react";
import { ButtonGroup, Button } from "@blueprintjs/core";

import classes from "./Board.module.css";
interface Props {}

type BoardArray = number[][];
const boardSize = 100;
const cellSize = 7;
const initialPopulation = 0.9;
const updateInterval = 500;
const initRandomBoard = (board: BoardArray) => {
  return board.map((row) =>
    row.map((cell) => Math.round(Math.random() * initialPopulation))
  );
};
const getNextCellState = (
  board: BoardArray,
  rowIdx: number,
  columnIdx: number
) => {
  const lenghtOfBoard = board.length;

  const sumRowAbove =
    rowIdx &&
    (columnIdx && board[rowIdx - 1][columnIdx - 1]) +
      board[rowIdx - 1][columnIdx] +
      ((columnIdx + 1 < lenghtOfBoard || 0) &&
        board[rowIdx - 1][columnIdx + 1]);
  const sumRowSame =
    (columnIdx && board[rowIdx][columnIdx - 1]) +
    ((columnIdx + 1 < lenghtOfBoard || 0) && board[rowIdx][columnIdx + 1]);
  const sumRowBelow =
    (rowIdx + 1 < lenghtOfBoard || 0) &&
    (columnIdx && board[rowIdx + 1][columnIdx - 1]) +
      board[rowIdx + 1][columnIdx] +
      ((columnIdx + 1 < lenghtOfBoard || 0) &&
        board[rowIdx + 1][columnIdx + 1]);
  const numberOfLiveNeighbors = sumRowAbove + sumRowSame + sumRowBelow;

  // Any dead cell with three live neighbours becomes a live cell.
  if (board[rowIdx][columnIdx] === 0 && numberOfLiveNeighbors === 3) return 1;
  // Any live cell with two or three live neighbours survives.
  if (
    board[rowIdx][columnIdx] === 1 &&
    (numberOfLiveNeighbors === 2 || numberOfLiveNeighbors === 3)
  )
    return 1;
  // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
  return 0;
};

const updateBoard = (board: BoardArray) =>
  board.map((row, rowIdx) =>
    row.map((_cell, cellIdx) => getNextCellState(board, rowIdx, cellIdx))
  );

const emptyBoard = new Array(boardSize)
  .fill(0)
  .map((row) => new Array(boardSize).fill(0));

const Board = (props: Props) => {
  const [board, setBoard] = useState<BoardArray>(initRandomBoard(emptyBoard));
  const [updating, setUpdating] = useState(true);
  const [enableDrawing, setEnableDrawing] = useState(false);
  useEffect(() => {
    // console.log("useEffect ing")
    const interval = setInterval(() => {
      if (updating) {
        // console.log("update board")
        setBoard((prev) => updateBoard(prev));
      }
    }, updateInterval);
    return () => {
      clearInterval(interval);
    };
  }, [updating]);

  const setCellAlive = (rowIdx: number, columnIdx: number) => {
    if (enableDrawing) {
      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((row) => [...row]);
        newBoard[rowIdx][columnIdx] = 1;
        return newBoard;
      });
    }else {
      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((row) => [...row]);
        newBoard[rowIdx][columnIdx] = Math.abs(newBoard[rowIdx][columnIdx] - 1);
        return newBoard;
      });
    }
    
  };

  const initToRandomBoard = () => {
    setBoard(initRandomBoard(emptyBoard));
  };

  const setBoardToEmpty = () => {
    setBoard(emptyBoard);
  };

  const countAlive = (board: BoardArray) => {
    const cellReducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
    const rowReducer = (accumulator: number, currentRow: number[]) => accumulator + currentRow.reduce(cellReducer, 0);
    const numAlive = board.reduce(rowReducer, 0);
    return numAlive;
  }

  return (
    <div className={classes.boardContainer}>
      <div className={classes.leftPanel}>
        <h1>Conway's Game of Life</h1>
        <div className={classes.description}>
          <p>
            <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
              More on Wikipedia
            </a>
          </p>
          <p>
            The Game of Life, also known simply as Life, is a cellular automaton
            devised by the British mathematician John Horton Conway in 1970. It
            is a zero-player game, meaning that its evolution is determined by
            its initial state, requiring no further input. One interacts with
            the Game of Life by creating an initial configuration and observing
            how it evolves. It is Turing complete and can simulate a universal
            constructor or any other Turing machine.
          </p>
          <p>
            <b>rules:</b>
            <ol>
              <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
              <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
              <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
              <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
            </ol>
            
          </p>
        </div>
        
        <div className={classes.instructions}>
          <p><b>Hover on board: </b>Pause Iteration</p>
          <p><b>Click: </b>Toggle life status</p>
          <p><b>Click and drag: </b>Set multiple cells as live</p>
        </div>

        <div>
          <p>{countAlive(board)} cells alive ({Math.round(countAlive(board)/(boardSize^2))}%)</p>
        </div>
        <div className={classes.controlPanel}>
        <ButtonGroup className={classes.controlBtns}>
          <Button icon="refresh" onClick={initToRandomBoard}>
            {"Randomize Board"}
          </Button>
          <Button icon="graph-remove" onClick={setBoardToEmpty}>
            {"Clear Board"}
          </Button>
        </ButtonGroup>
      </div>
      </div>
      
      <div
        className={classes.board}
        style={{ width: boardSize * cellSize, height: boardSize * cellSize }}
        onMouseEnter={() => {
          setUpdating(false);
          console.log("Mouse Enter");
        }}
        onMouseLeave={() => {
          setEnableDrawing(false)
          setUpdating(true); 
        }}
        onMouseDown={() => setEnableDrawing(true)}
        onMouseUp={() => setEnableDrawing(false)}
      >
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className={classes.row}>
            {row.map((cell, cellIdx) => (
              <div
                key={cellIdx}
                className={
                  cell
                    ? [classes.cell, classes.liveCell].join(" ")
                    : classes.cell
                }
                onClick={() => setCellAlive(rowIdx, cellIdx)}
                onMouseEnter={() => {
                  if (enableDrawing) {
                    setCellAlive(rowIdx, cellIdx);
                  }
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Board;
