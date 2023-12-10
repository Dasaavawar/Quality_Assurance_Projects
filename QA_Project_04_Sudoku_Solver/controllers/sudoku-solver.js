class SudokuSolver {
  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      default:
        return "none";
    }
  }

  transformString(puzzleString) {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    let row = -1;
    let col = 0;

    for (let i = 0; i < puzzleString.length; i++) {
      if (i % 9 == 0) {
        row++;
      }
      if (col % 9 == 0) {
        col = 0;
      }
      grid[row][col] = puzzleString[i] === '.' ? 0 : +puzzleString[i];
      col++;
    }
    return grid;
  }

  transformGrid(grid) {
    return grid.flat().join("");
  };

  solveSudoku(grid, row, col) {
    if (row == 9 - 1 && col == 9)
      return grid;

    // Check if column value  becomes 9, move next and start over
    if (col == 9) {
      row++;
      col = 0;
    }

    // Check if the current position contains value >0, we move next
    if (grid[row][col] != 0)
      return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      // Check if it is safe to place num in the given position
      if (this.isSafe(grid, row, col, num)) {

        // Assigning the num in the current position and supposing it is correct
        grid[row][col] = num;

        // Checking for next possibility with next column
        if (this.solveSudoku(grid, row, col + 1))
          return grid;
      }

      // Removing the assigned num if assumption was wrong, start over
      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    // Check if we find the same num in each row
    for (let x = 0; x <= 8; x++)
      if (grid[row][x] == num)
        return false;

    // Check if we find the same num in each col
    for (let x = 0; x <= 8; x++)
      if (grid[x][col] == num)
        return false;

    // Check if we find the same num in each cell
    let startRow = row - row % 3,
      startCol = col - col % 3;

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num)
          return false;

    return true;
  }

  checkRowPlacement(puzzleString, row, col, value) {
    let grid = this.transformString(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][col - 1] == value)
      return true;
    for (let i = 0; i < 9; i++)
      if (grid[row - 1][i] == value)
        return false;
    return true;
  }

  checkColPlacement(puzzleString, row, col, value) {
    let grid = this.transformString(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][col - 1] == value)
      return true;
    for (let i = 0; i < 9; i++)
      if (grid[i][col - 1] == value)
        return false;
    return true;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let grid = this.transformString(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][col - 1] == value)
      return true;
    let startRow = ((row - 1) / 3 | 0) * 3;
    let startCol = ((col - 1) / 3 | 0) * 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == value)
          return false;
    return true;
  }

  validate(puzzleString) {
    if (puzzleString.length !== 81 || !/^[0-9.]+$/.test(puzzleString)) {
      return false;
    }
    let grid = this.transformString(puzzleString);
    let solved = this.solveSudoku(grid, 0, 0);
    if (!solved) {
      return false;
    }
    let solvedString = this.transformGrid(solved);
    if (solvedString.length != 81) {
      return false;
    }
    return solvedString;
  }
}

module.exports = SudokuSolver;