/**
 * Copyright Chamber Designs 2022 - All Rights Reserved
 */

export class board {
  rows = [];
  columns = [];
  squares = [];
  constructor(rows, columns, squares) {
    this.rows = rows;
    this.columns = columns;
    this.squares = squares;
  }

  /**
   * Return reference to specific cell using cartesian coordinates
   * @param {int} x
   * @param {int} y
   * @returns cell
   */
  getCell({ x, y }) {
    return this.rows[y].getCells()[x];
  }

  /**
   * Return reference to cell with lowest entropy
   * @returns {cell}
   */
  getLowestEntropyCellLoc() {
    let lowestEntropy = 100; // arbitrary high number
    const lowestEntropyCellLoc = {
      x: null,
      y: null,
    };
    this.rows.forEach((row, y) => {
      row.cells.forEach((cell, x) => {
        const entropy = cell.getEntropy();
        if (entropy > 0 && entropy < lowestEntropy) {
          lowestEntropy = entropy;
          lowestEntropyCellLoc.x = x;
          lowestEntropyCellLoc.y = y;
        }
      });
    });
    return lowestEntropyCellLoc;
  }

  /**
   * Check if game is complete
   * @returns {boolean}
   */
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

  /**
   * Update the current state of the board with the latest updates
   */
  getBoardClone() {
    const newState = new board(this.rows, this.columns, this.squares);
    return newState;
  }

  /**
   * Return false when a cell has no possible values but a value of 0
   * Return true when the algorithm can continue
   */
  canContinue() {
    this.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        if (cell.value === 0 && cell.getEntropy() === 0) {
          return false;
        }
      });
    });
    return true;
  }

  /**
   * Return a count of the total entropy on the board
   * @returns {int}
   */
  getTotalEntropy() {
    let totalEntropy = 0;
    this.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        totalEntropy += cell.getEntropy();
      });
    });
    return totalEntropy;
  }

  // propogate updates to the board
  propagateUpdates(cell, value) {
    if (!value) {
      return;
    }
    if (cell.value !== value) {
      cell.setValue(value);
    }

    this.rows[cell.x].cells.forEach((rowCell) => {
      rowCell.removePossibleValue(value);
    });
    this.columns[cell.y].cells.forEach((colCell) => {
      colCell.removePossibleValue(value);
    });
    this.squares[cell.sq].cells.forEach((sqCell) => {
      sqCell.removePossibleValue(value);
    });
  }
}
