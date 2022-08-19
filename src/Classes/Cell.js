/**
 * Copyright Chamber Designs 2022 - All Rights Reserved
 */

export class cell {
  constructor(x, y, row, col, sq) {
    this.cellRef = { x, y };
    this.entropy = 9;
    this.x = x;
    this.y = y;
    this.value = 0;
    this.possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.backgroundColor = "white";
    this.row = row;
    this.col = col;
    this.sq = sq;
  }

  removePossibleValue(value) {
    this.possibleValues = this.possibleValues.filter((possibleValue) => {
      return possibleValue !== value;
    });
    this.entropy = this.possibleValues.length;
  }

  setValue(value) {
    this.value = value;
    if (value !== 0) {
      this.possibleValues = [];
      this.entropy = 0;
    }
  }

  getEntropy() {
    return this.entropy;
  }

  getPossibleValues() {
    return this.possibleValues;
  }

  /**
   * Returrn current cellRef
   * @returns {cellRef}
   */
  getCellRef() {
    return this.cellRef;
  }
}

export class cellGroup {
  constructor(cells) {
    this.cells = cells;
  }

  getCells() {
    return this.cells;
  }

  getEntropy() {
    return this.cells.reduce((entropy, cell) => {
      return entropy + cell.getEntropy();
    }, 0);
  }
}

export class row extends cellGroup {}

export class column extends cellGroup {}

export class square extends cellGroup {}
