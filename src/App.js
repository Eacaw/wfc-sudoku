import "./App.css";
import { useEffect, useState } from "react";
import SudokuCard from "./Components/SudokuCard";
import { Card, CardContent, CardHeader } from "@mui/material";

function App() {
  const [currentBoard, setCurrentBoard] = useState(null);
  const [setupStarted, setSetupStarted] = useState(false);

  // array with 9 colours in it
  const colours = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
  ];
  class cell {
    constructor(x, y, value) {
      this.cellRef = { x, y };
      this.entropy = 9;
      this.x = x;
      this.y = y;
      this.value = value;
      this.possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this.backgroundColor = "white";
    }

    removePossibleValue(value) {
      this.possibleValues = this.possibleValues.filter(
        (possibleValue) => possibleValue !== value
      );
      this.entropy = this.possibleValues.length;
    }

    setValue(value) {
      this.value = value;
      this.possibleValues = [];
      this.entropy = 0;
    }

    getEntropy() {
      return this.entropy;
    }
  }

  class cellGroup {
    constructor(cells) {
      this.cells = cells;
    }

    isCellInGroup(cell) {
      return this.cells.includes(cell);
    }

    getCells() {
      return this.cells;
    }
  }

  class row extends cellGroup {
    constructor(cells) {
      super(cells);
    }
  }

  class column extends cellGroup {
    constructor(cells) {
      super(cells);
    }
  }

  class square extends cellGroup {
    constructor(cells) {
      super(cells);
    }
  }

  class board {
    constructor(rows, columns, squares) {
      this.rows = rows;
      this.columns = columns;
      this.squares = squares;
    }

    getCell(x, y) {
      return this.rows[x].cells[y];
    }

    getLowestEntropyCell() {
      let lowestEntropyCell = null;
      let lowestEntropy = 100; // arbitrary high number
      this.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          const entropy = cell.getEntropy();
          if (entropy > 0 && entropy < lowestEntropy) {
            lowestEntropy = entropy;
            lowestEntropyCell = cell;
          }
        });
      });
      return lowestEntropyCell;
    }

    isBoardComplete() {
      let isComplete = true;
      this.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (cell.value === 0) {
            isComplete = false;
          }
        });
      });
      return isComplete;
    }

    saveCurrentState() {
      const newState = new board(this.rows, this.columns, this.squares);
      setCurrentBoard(newState);
    }

    getCurrentStateAsBoard() {
      return this;
    }

    printBoardToConsoleByRow() {
      this.rows.forEach((row) => {
        let rowOutput = "";
        row.cells.forEach((cell) => {
          rowOutput += cell.value;
        });
        console.log(rowOutput);
      });
    }

    printBoardEntropiesToConsoleByRow() {
      this.rows.forEach((row) => {
        let rowOutput = "";
        row.cells.forEach((cell) => {
          rowOutput += cell.possibleValues.length;
        });
        console.log(rowOutput);
      });
    }

    convertBoardToJSON() {
      let boardJSON = {};
      this.rows.forEach((row) => {
        let rowOutput = "";
        row.cells.forEach((cell) => {
          rowOutput += cell.value;
        });
        boardJSON[row.x] = rowOutput;
      });
      return boardJSON;
    }

    getAllCellsWithLowestEntropy() {
      const lowestEntropyCell = this.getLowestEntropyCell();
      let cellsWithLowestEntropy = [];
      if (lowestEntropyCell) {
        const lowestEntropy = lowestEntropyCell.getEntropy();
        if (lowestEntropy !== 0) {
          this.rows.forEach((row) => {
            row.cells.forEach((cell) => {
              if (cell.getEntropy() === lowestEntropy) {
                cellsWithLowestEntropy.push(cell);
              }
            });
          });
        }
      }

      return cellsWithLowestEntropy;
    }

    getAllCellsWithEntropyOf1() {
      let cellsWithEntropyOf1 = [];
      this.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (cell.getEntropy() === 1) {
            console.log(cell);

            console.log(
              "cell has entropy: ",
              cell.getEntropy(),
              " at position: ",
              cell.x,
              cell.y
            );
            cellsWithEntropyOf1.push(cell);
          }
        });
      });
      return cellsWithEntropyOf1;
    }

    clearAllPreservedCells() {
      this.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          cell.isPreserved = false;
        });
      });
    }
  }

  function generateZerosBoard() {
    const rows = [];
    const columns = [];
    const squares = [];
    const cells = [];
    for (let i = 0; i < 9; i++) {
      rows.push([]);
      columns.push([]);
      squares.push([]);
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        cells.push(new cell(i, j, 0));
      }
    }

    for (let i = 0; i < 9; i++) {
      // populate rows with cells with the same y coordinate
      rows[i] = new row(cells.filter((cell) => cell.y === i));
    }

    for (let i = 0; i < 9; i++) {
      // populate columns with cells with the same x coordinate
      columns[i] = new column(cells.filter((cell) => cell.x === i));
    }

    // columns.forEach((column) => {
    //   const index = column.cells[0].x;
    //   column.cells.forEach((cell) => {
    //     cell.backgroundColor = colours[index];
    //   });
    // });

    // rows.forEach((row) => {
    //   const index = row.cells[0].y;
    //   row.cells.forEach((cell) => {
    //     cell.backgroundColor = colours[index];
    //   });
    // });

    // populate squares with cells in 9 groups of 3x3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        squares[index] = new square(
          cells.filter(
            (cell) =>
              cell.x >= j * 3 &&
              cell.x < j * 3 + 3 &&
              cell.y >= i * 3 &&
              cell.y < i * 3 + 3
          )
        );
        // squares[index].cells.forEach((cell) => {
        //   cell.backgroundColor = colours[index];
        // });
      }
    }

    const zerosBoard = new board(rows, columns, squares);
    return zerosBoard;
  }

  function propagateUpdate(cell, val) {
    cell.setValue(val);

    const row = cell.y;
    const column = cell.x;
    const square = Math.floor(cell.x / 3) + Math.floor(cell.y / 3) * 3;
    console.log("sq", square);

    const rowCells = currentBoard.rows[row].cells;
    const columnCells = currentBoard.columns[column].cells;
    const squareCells = currentBoard.squares[square].cells;

    rowCells.forEach((rowCell) => {
      if (rowCell !== cell) {
        rowCell.removePossibleValue(val);
      }
    });
    columnCells.forEach((columnCell) => {
      if (columnCell !== cell) {
        columnCell.removePossibleValue(val);
      }
    });
    squareCells.forEach((squareCell) => {
      console.log("square", squareCell.cellRef);

      if (squareCell !== cell) {
        squareCell.removePossibleValue(val);
      }
    });
  }

  function solve() {
    let currentIteration = 0;
    // while (!currentBoard.isBoardComplete()) {
    let cells = currentBoard.getAllCellsWithLowestEntropy();
    if (cells.length === 0) {
      currentBoard.saveCurrentState();
      return;
    }

    if (cells.length > 1 && cells[0].possibleValues.length >= 1) {
      propagateUpdate(cells[0], cells[0].possibleValues[0]);
    } else if (cells.length === 1 && cells[0].possibleValues.length !== 0) {
      const cell = cells[0];
      if (!cell.possibleValues[0]) {
        currentBoard.saveCurrentState();

        return;
      }
      propagateUpdate(cell, cell.possibleValues[0]);
    }

    currentBoard.saveCurrentState();

    currentIteration++;
    if (currentIteration > 100) {
      alert("no solution");
      return;
      // }
    }
  }

  useEffect(() => {
    const zerosBoard = generateZerosBoard();
    setCurrentBoard(zerosBoard);
  }, []);

  useEffect(() => {
    if (currentBoard && !setupStarted) {
      setSetupStarted(true);
      setupInitialBoard();
    }
  }, [currentBoard]);

  function findCellInBoardObject(x, y) {
    return currentBoard.getCell(x, y);
  }

  function setupInitialBoard() {
    // First Row
    propagateUpdate(findCellInBoardObject(0, 1), 6);
    propagateUpdate(findCellInBoardObject(0, 3), 9);
    propagateUpdate(findCellInBoardObject(0, 7), 8);
    // Second Row
    propagateUpdate(findCellInBoardObject(1, 3), 3);
    propagateUpdate(findCellInBoardObject(1, 8), 2);
    // Third Row
    propagateUpdate(findCellInBoardObject(2, 0), 4);
    propagateUpdate(findCellInBoardObject(2, 2), 2);
    propagateUpdate(findCellInBoardObject(2, 8), 3);
    // Fourth Row
    propagateUpdate(findCellInBoardObject(3, 2), 4);
    propagateUpdate(findCellInBoardObject(3, 4), 3);
    propagateUpdate(findCellInBoardObject(3, 3), 2);
    // Fifth Row
    propagateUpdate(findCellInBoardObject(4, 0), 5);
    propagateUpdate(findCellInBoardObject(4, 4), 8);
    propagateUpdate(findCellInBoardObject(4, 8), 1);
    // Sixth Row
    propagateUpdate(findCellInBoardObject(5, 4), 6);
    propagateUpdate(findCellInBoardObject(5, 5), 1);
    propagateUpdate(findCellInBoardObject(5, 6), 5);
    // Seventh Row
    propagateUpdate(findCellInBoardObject(6, 0), 2);
    propagateUpdate(findCellInBoardObject(6, 6), 3);
    propagateUpdate(findCellInBoardObject(6, 8), 5);
    // Eighth Row
    propagateUpdate(findCellInBoardObject(7, 0), 9);
    propagateUpdate(findCellInBoardObject(7, 5), 4);
    // Ninth Row
    propagateUpdate(findCellInBoardObject(8, 1), 7);
    propagateUpdate(findCellInBoardObject(8, 5), 3);
    propagateUpdate(findCellInBoardObject(8, 7), 9);
    currentBoard.printBoardToConsoleByRow();
  }

  function getHeatmapColour(entropy) {
    // Return a hex value between black and white depending on the entropy
    const heatmapColour = Math.floor(255 * (1 - entropy / 10)).toString(16);
    return `#${heatmapColour}${heatmapColour}${heatmapColour}`;
  }

  return (
    <div>
      <h1>Open up the console</h1>
      <button onClick={solve}>Solve</button>
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
          <div className="container">
            <ul>
              {currentBoard &&
                currentBoard.rows.map((row, idx) => {
                  const cells = row.getCells();
                  return cells.map((cell, idx) => {
                    return (
                      <li
                        id={cell.cellRef}
                        style={{
                          backgroundColor: getHeatmapColour(cell.getEntropy()),
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
