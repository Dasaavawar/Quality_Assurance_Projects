'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {
  
  let solver = new SudokuSolver();
  app.route('/api/check')
    .post((req, res) => {
      
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: "Required field(s) missing" });
      }
      
      let row = coordinate.split("")[0];
      let col = coordinate.split("")[1];
      if (!coordinate || coordinate.length !== 2 || !/[a-i]/i.test(row) || !/^[1-9]$/.test(col)) {
        return res.json({ error: "Invalid coordinate" });
      }
      
      if (!value || !/^[1-9]$/.test(value)) {
        return res.json({ error: "Invalid value" })
      }
      
      if (!puzzle || puzzle.length != 81) {
        return res.json({ error: "Expected puzzle to be 81 characters long" });
      }
      
      if (/[^0-9.]/g.test(puzzle)) {
        return res.json({ error: "Invalid characters in puzzle" });
      }

      let validCol = solver.checkColPlacement(puzzle, row, col, value);
      let validRow = solver.checkRowPlacement(puzzle, row, col, value);
      let validReg = solver.checkRegionPlacement(puzzle, row, col, value);
      let conflicts = [];
      if (validCol && validRow && validReg) {
        return res.json({ valid: true });
      } else {
        if (!validRow) {
          conflicts.push("row");
        }
        if (!validCol) {
          conflicts.push("column");
        }
        if (!validReg) {
          conflicts.push("region");
        }
        return res.json({ valid: false, conflict: conflicts });
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      
      const { puzzle } = req.body;
      if (!puzzle || puzzle == undefined) {
        return res.json({ error: 'Required field missing' });
      } else if (puzzle.length != 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      } else if (/[^0-9.]/g.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      let solvedPuzzle = solver.validate(puzzle);
      if (!solvedPuzzle) {
        return res.json({ error: 'Puzzle cannot be solved' });
      } else {
        return res.json({ solution: solvedPuzzle });
      }

    });
};