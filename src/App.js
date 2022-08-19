/**
 * Copyright Chamber Designs 2022 - All Rights Reserved
 */

import "./App.css";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { cell, row, column, square } from "./Classes/Cell";
import { board } from "./Classes/Board";
import { StateStack } from "./Classes/StateStack";
import { easy } from "./SodukuPuzzles";

function App() {
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentStateStack, setCurrentStateStack] = useState(new StateStack());

  //Instatiate and populate board with empty cells
  useEffect(() => {
    // Create an array with 9 arrays in it
    const rows = [[], [], [], [], [], [], [], [], []];
    const cols = [[], [], [], [], [], [], [], [], []];
    const squares = [[], [], [], [], [], [], [], [], []];
    // Create 81 cells into an array
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        const initialVal = easy[x][y];
        const index = x * 9 + y;
        const sqIndex =
          Math.floor((index % 9) / 3) + 3 * Math.floor(index / 27);
        const newCell = new cell(y, x, y, x, sqIndex);
        rows[y].push(newCell);
        cols[x].push(newCell);
        squares[sqIndex].push(newCell);
        newCell.setValue(initialVal);
      }
    }

    // Create 9 rows from the relevant cells
    const rowRefs = [];
    const colRefs = [];
    const sqRefs = [];
    for (let x = 0; x < 9; x++) {
      rowRefs.push(new row(rows[x]));
      colRefs.push(new column(cols[x]));
      sqRefs.push(new square(squares[x]));
    }

    // Create a new board from the above data
    const newBoard = new board(rowRefs, colRefs, sqRefs);
    // propogate update for all cells
    newBoard.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        newBoard.propagateUpdates(cell, cell.value);
      });
    });

    // Update possible values for all cells

    setCurrentBoard(newBoard);
  }, []);

  function iterate() {
    let iterationBoard = currentBoard.getBoardClone();
    if (iterationBoard.isBoardComplete()) {
      alert("Board SOLVED!");
      return;
    }

    // Get the lowest entropy cell
    // If there are multiple, pick the first one
    const { x: selectedX, y: selectedY } =
      iterationBoard.getLowestEntropyCellLoc();
    const lowestEntropyCell = iterationBoard.getCell({
      x: selectedX,
      y: selectedY,
    });
    if (lowestEntropyCell === null) {
      alert("Board unsolveable");
      return;
    }

    // Get the possible values for the cell
    const possibleValues = lowestEntropyCell.getPossibleValues();
    // If there are no possible values, return
    if (possibleValues.length === 0) {
      alert("Board unsolveable");
      return;
    }

    // Pop off the top value from the possible values array
    // and save a separate copy of the board to restore later
    const restoreState = iterationBoard.getBoardClone();
    // Remove the selected possible value from the relevant cell on the iterationState
    let attemptedCollapsedCell = restoreState.getCell({
      x: selectedX,
      y: selectedY,
    });

    attemptedCollapsedCell.removePossibleValue(possibleValues[0]);

    // Onlyadd a state reference to the stack if the cell
    // has entropy of 1 or higher
    if (attemptedCollapsedCell.entropy > 0) {
      setCurrentStateStack(currentStateStack.getClone());
      currentStateStack.push(restoreState);
    }

    // Propagate the update to the relevant cells
    iterationBoard.propagateUpdates(lowestEntropyCell, possibleValues[0]);

    // Recurse if the board can't continue or total entprpy is 0
    if (
      !iterationBoard.canContinue() ||
      iterationBoard.getTotalEntropy() === 0
    ) {
      // Restore the board to the last state
      setCurrentBoard(currentStateStack.pop());
      iterate();
    } else {
      setCurrentBoard(iterationBoard);
      iterate();
    }
  }

  return (
    <div>
      <Card
        className="container"
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "blue",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
          margin: "10px",
          padding: "10px",
        }}
      >
        <CardHeader title="Sudoku" />
        <CardContent>
          <div>
            <button onClick={iterate}>Solve</button>

            <ul>
              {currentBoard &&
                currentBoard.rows.map((row, idx) => {
                  const cells = row.getCells();
                  return cells.map((cell, idx) => {
                    return (
                      <li
                        id={cell.cellRef}
                        style={{
                          backgroundColor: cell.backgroundColor,
                        }}
                      >
                        <span>{cell.value}</span>
                      </li>
                    );
                  });
                })}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
