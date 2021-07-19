import React, { useEffect, useState } from "react";

export type BoardArray = number[][];

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

/**
 * 
 * @param boardSize size of the board, eg. 100 means 100x100 board
 * @param updateInterval in msec
 * @param initialPopulation between 0 and 1
 * @returns board,  setBoard, updating, setUpdating, emptyBoard, initRandomBoard,
 */

export const useBoard = (initBoard: BoardArray, updateInterval: number) => {

  const [board, setBoard] = useState<BoardArray>(initBoard);
  const [updating, setUpdating] = useState(true);
  useEffect(() => {

    const interval = setInterval(() => {
      if (updating) {

        setBoard((prev) => updateBoard(prev));
      }
    }, updateInterval);
    return () => {
      clearInterval(interval);
    };
  }, [updateInterval, updating]);

  return {
    board,
    setBoard,
    updating,
    setUpdating,

  }
}
