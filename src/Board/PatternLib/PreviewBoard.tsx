import React from "react";
import classes from "../Board.module.css";

import { useBoard, BoardArray } from "../useBoard";

interface Props {
  pattern: number[][];
  onSelect: (patternSelected: BoardArray) => void;
}

const getNewPattern = (pattern: number[][]) => {
  const numOfRows = pattern.length;
  const numOfColumns = Math.max(...pattern.map((row) => row.length));
  const newPattern = new Array(numOfRows + 2)
    .fill(0)
    .map((row) => new Array(numOfColumns + 2).fill(0));
  for (let i = 0; i < numOfRows; i++) {
    for (let j = 0; j < numOfColumns; j++) {
      newPattern[i + 1][j + 1] = pattern[i][j];
    }
  }
  return newPattern;
};

const cellSize = 7;
const updateInterval = 500;
export const PreviewBoard = (props: Props) => {
  const newPattern = getNewPattern(props.pattern);
  const numOfRows = newPattern.length;
  const numOfColumns = Math.max(...newPattern.map((row) => row.length));
  const { board } = useBoard(newPattern, updateInterval);
  return (
    <div
      className={classes.previewCard}
      style={{ width: "90px", height: "90px" }}
      onClick={()=> props.onSelect(props.pattern)}
    >
      <div
        className={classes.board}
        style={{ width: numOfColumns * cellSize, height: numOfRows * cellSize }}
      >
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className={classes.row}>
            {row.map((cell, cellIdx) => (
              <div
                key={cellIdx}
                className={
                  cell
                    ? [classes.previewCell, classes.liveCell].join(" ")
                    : classes.previewCell
                }
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
