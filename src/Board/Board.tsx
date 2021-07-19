import React, { useState } from "react";
// import { ButtonGroup, Button, Overlay } from "@blueprintjs/core";

import { Button, ButtonGroup, Divider, Flex, Heading, Link, Text } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { useBoard, BoardArray } from "./useBoard";
import { stillLifes, ossillators, spaceships, infGrowth } from "./PatternLib/patterns";
import { PreviewBoard } from "./PatternLib/PreviewBoard";

import classes from "./Board.module.css";

const block = [
  [1, 1],
  [1, 1],
]

const boardSize = 100;
const cellSize = 7;
const initialPopulation = 0.9;
const updateInterval = 200;

const emptyBoard = new Array(boardSize)
  .fill(0)
  .map((row) => new Array(boardSize).fill(0));
const initRandomBoard = (board: BoardArray) => {
  return board.map((row) =>
    row.map((cell) => Math.round(Math.random() * initialPopulation))
  );
};

/**
 * 
 * @param board 
 * @param pattern 
 * @param rowIdx 
 * @param cellIdx 
 * @returns new board
 */
const renderPatternOnBoard = (board: BoardArray, pattern: BoardArray, rowIdx: number, cellIdx: number) => {
  const patternWidth = pattern[0].length;
  const patternHeight = pattern.length;
  const boardSize = board.length;

  let newBoard = [...board.map(row => [...row])];
  let centerIdxY = Math.round(patternHeight/2) - 1;
  let centerIdxX = Math.round(patternWidth/2) - 1;

  let rowOffeset = rowIdx - centerIdxY;
  let cellOffset = cellIdx - centerIdxX;

  let patternToRender = pattern;
  if (rowOffeset < 0) {
    const missingRows = Math.abs(rowOffeset);
    patternToRender = patternToRender.slice(missingRows);
    centerIdxY = centerIdxY - missingRows;
    rowOffeset = 0;
  }
  if (boardSize - rowIdx < patternHeight - centerIdxY) {
    const missingRows = (patternHeight - centerIdxY) - (boardSize - rowIdx);
    patternToRender = patternToRender.slice(0, -missingRows);
  }

  if (cellOffset < 0) {
    const missingCells = Math.abs(cellOffset);
    patternToRender = patternToRender.map(row => row.slice(missingCells));
    cellOffset = 0;
  }
  if (boardSize - cellIdx < patternWidth - centerIdxX) {
    const missingCells = patternWidth - centerIdxX - boardSize + cellIdx;
    patternToRender = patternToRender.map(row => row.slice(0, -missingCells));
  }

  patternToRender.forEach((row, patterRowIdx) => {
    row.forEach((cell, patterCellIdx) => {
      newBoard[patterRowIdx+rowOffeset][patterCellIdx+cellOffset] = board[patterRowIdx+rowOffeset][patterCellIdx+cellOffset] || cell;
    })
  })
  return newBoard;
}

const Board = () => {
  const { board, setBoard, setUpdating } = useBoard(
    initRandomBoard(emptyBoard),
    updateInterval
  );

  const [demoBoard, setDemoBoard] = useState<BoardArray>(emptyBoard);


  const [enableDrawing, setEnableDrawing] = useState(false);
  const [isLibOpen, setLibOpen] = useState(false);
  const [isPutting, setIsPutting] = useState(false);
  const [patternToPut, setPatternToPut] = useState<BoardArray>(block);

  const setCellAlive = (rowIdx: number, columnIdx: number) => {
    if (enableDrawing) {
      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((row) => [...row]);
        newBoard[rowIdx][columnIdx] = 1;
        return newBoard;
      });
    } else {
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
    const cellReducer = (accumulator: number, currentValue: number) =>
      accumulator + currentValue;
    const rowReducer = (accumulator: number, currentRow: number[]) =>
      accumulator + currentRow.reduce(cellReducer, 0);
    const numAlive = board.reduce(rowReducer, 0);
    return numAlive;
  };

  const libOpenHandler = () => {
    setUpdating(false);
    setLibOpen(true);
  };
  const libCloseHandler = () => {
    setLibOpen(false);
    setUpdating(true);
  };

  const mouseEnterCellHandler = (rowIdx: number, cellIdx: number) => {
    if (enableDrawing) {
      setCellAlive(rowIdx, cellIdx);
    }else if (isPutting) {
      setDemoBoard(renderPatternOnBoard(board, patternToPut, rowIdx, cellIdx));
    }
  }

  const mouseClickCellHandler = (rowIdx: number, cellIdx: number) => {
    if (!isPutting) {
      setCellAlive(rowIdx, cellIdx);
    }else {
      setBoard(prev => renderPatternOnBoard(prev, patternToPut, rowIdx, cellIdx));
      setIsPutting(false);
    }
  }

  const selectFromLibHandler = (patternSelected: BoardArray) => {
    setIsPutting(true);
    setUpdating(false);
    setDemoBoard(board);
    setLibOpen(false);
    setPatternToPut(patternSelected);
  }


  const boardToDisplay = isPutting? demoBoard : board;
  return (
    <div className={classes.boardContainer}>
      <div className={classes.leftPanel}>
        <Heading as='h3' size='lg'>Conway's Game of Life</Heading>
        {/* <PreviewBoard
          pattern={patterns[1]}
        /> */}

        <div className={classes.description}>
          <Text>
            <Link href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
              More on Wikipedia
            </Link>
          </Text>
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
            <b>Rules:</b>
            <ol>
              <li>
                Any live cell with fewer than two live neighbours dies, as if by
                underpopulation.
              </li>
              <li>
                Any live cell with two or three live neighbours lives on to the
                next generation.
              </li>
              <li>
                Any live cell with more than three live neighbours dies, as if
                by overpopulation.
              </li>
              <li>
                Any dead cell with exactly three live neighbours becomes a live
                cell, as if by reproduction.
              </li>
            </ol>
          </p>
        </div>

        <div className={classes.instructions}>
          <p>
            <b>Hover on board: </b>Pause Iteration
          </p>
          <p>
            <b>Click: </b>Toggle life status
          </p>
          <p>
            <b>Click and drag: </b>Set multiple cells as live
          </p>
        </div>

        <div>
          <p>
            {countAlive(board)} cells alive (
            {Math.round(countAlive(board) / (boardSize ^ 2))}%)
          </p>
        </div>
        <div className={classes.controlPanel}>
          <ButtonGroup className={classes.controlBtns}>
            <Button variant="outline" onClick={initToRandomBoard}>
              Randomize Board
            </Button>
            <Button variant="outline" onClick={setBoardToEmpty}>
              Clear Board
            </Button>
            <Button variant="outline" onClick={libOpenHandler}>
              Show Pattern Library
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className={classes.rightPanel}>
        <div
          className={classes.board}
          style={{ width: boardSize * cellSize, height: boardSize * cellSize }}
          onMouseEnter={() => {
            setUpdating(false);
          }}
          onMouseLeave={() => {
            setEnableDrawing(false);
            setUpdating(true);
          }}
          onMouseDown={() => {
            if(!isPutting){
              setEnableDrawing(true)
            }
          }}
          onMouseUp={() => {
            if(!isPutting){
              setEnableDrawing(false)
            }
          }}
        >
          {boardToDisplay.map((row, rowIdx) => (
            <div key={rowIdx} className={classes.row}>
              {row.map((cell, cellIdx) => (
                <div
                  key={cellIdx}
                  className={
                    isPutting? (cell
                      ? [classes.previewCell, classes.liveCell].join(" ")
                      : classes.previewCell):
                    (cell
                      ? [classes.cell, classes.liveCell].join(" ")
                      : classes.cell)
                  }
                  onClick={() => mouseClickCellHandler(rowIdx, cellIdx)}
                  onMouseEnter={() => mouseEnterCellHandler(rowIdx, cellIdx)}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isLibOpen}
        onClose={libCloseHandler}
        motionPreset="none"
        size="xl" 
        
      >
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>Pattern Library</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading as="h4" size="md">
              Still Lifes
            </Heading>
            <Flex wrap='wrap'>
              {stillLifes.map((pattern, idx) => (
                <PreviewBoard key={`stationary ${idx} `} pattern={pattern} onSelect={selectFromLibHandler}/>
              ))}
            </Flex>
            <Divider orientation="horizontal" />

            <Heading as="h4" size="md">
              ossillators
            </Heading>
            <Flex wrap='wrap'>
              {ossillators.map((pattern, idx) => (
                <PreviewBoard key={`stationary ${idx} `} pattern={pattern} onSelect={selectFromLibHandler}/>
              ))}
            </Flex>
            <Divider orientation="horizontal" />

            <Heading as="h4" size="md">
              Spaceships
            </Heading>
            <Flex wrap='wrap'>
              {spaceships.map((pattern, idx) => (
                <PreviewBoard key={`stationary ${idx} `} pattern={pattern} onSelect={selectFromLibHandler}/>
              ))}
            </Flex>
            <Divider orientation="horizontal" />

            <Heading as="h4" size="md">
              Infinite Growth
            </Heading>
            <Flex wrap='wrap'>
              {infGrowth.map((pattern, idx) => (
                <PreviewBoard key={`stationary ${idx} `} pattern={pattern} onSelect={selectFromLibHandler}/>
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Board;
