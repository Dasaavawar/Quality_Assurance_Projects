# freeCodeCamp - Quality Assurance - Projects - IV - Sudoku Solver


## 4. Projects - Sudoku Solver

This is the boilerplate for the Sudoku Solver project. Instructions to complete your project can be found at [https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver)

Build a full stack JavaScript app that is functionally similar to this: [https://sudoku-solver.freecodecamp.rocks/](https://sudoku-solver.freecodecamp.rocks/). Working on this project will involve you writing your code using one of the following methods:

  *  Clone [this GitHub repo](https://github.com/freecodecamp/boilerplate-project-sudoku-solver) and complete your project locally.
  *  Use [our Replit starter project](https://replit.com/github/freeCodeCamp/boilerplate-project-sudoku-solver) to complete your project.
  *  Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

  *  Start by importing the project on Replit.
  *  Next, you will see a `.replit` window.
  *  Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the Solution Link field. Optionally, also submit a link to your project's source code in the GitHub Link field.

  *  All puzzle logic can go into `/controllers/sudoku-solver.js`
      *  The `validate` function should take a given puzzle string and check it to see if it has 81 valid characters for the input.
      *  The `check` functions should be validating against the current state of the board.
      *  The `solve` function should handle solving any given valid puzzle string, not just the test inputs and solutions. You are expected to write out the logic to solve this.
  *  All routing logic can go into `/routes/api.js`
  *  See the `puzzle-strings.js` file in `/controllers` for some sample puzzles your application should solve
  *  To run the challenge tests on this page, set `NODE_ENV` to `test` without quotes in the `.env` file
  *  To run the tests in the console, use the command `npm run test`. To open the Replit console, press Ctrl+Shift+P (Cmd if on a Mac) and type "open shell"

Write the following tests in `tests/1_unit-tests.js`:

  *  Logic handles a valid puzzle string of 81 characters
  *  Logic handles a puzzle string with invalid characters (not 1-9 or `.`)
  *  Logic handles a puzzle string that is not 81 characters in length
  *  Logic handles a valid row placement
  *  Logic handles an invalid row placement
  *  Logic handles a valid column placement
  *  Logic handles an invalid column placement
  *  Logic handles a valid region (3x3 grid) placement
  *  Logic handles an invalid region (3x3 grid) placement
  *  Valid puzzle strings pass the solver
  *  Invalid puzzle strings fail the solver
  *  Solver returns the expected solution for an incomplete puzzle

Write the following tests in tests/2_functional-tests.js

  *  Solve a puzzle with valid puzzle string: POST request to `/api/solve`
  *  Solve a puzzle with missing puzzle string: POST request to `/api/solve`
  *  Solve a puzzle with invalid characters: POST request to `/api/solve`
  *  Solve a puzzle with incorrect length: POST request to `/api/solve`
  *  Solve a puzzle that cannot be solved: POST request to `/api/solve`
  *  Check a puzzle placement with all fields: POST request to `/api/check`
  *  Check a puzzle placement with single placement conflict: POST request to `/api/check`
  *  Check a puzzle placement with multiple placement conflicts: POST request to `/api/check`
  *  Check a puzzle placement with all placement conflicts: POST request to `/api/check`
  *  Check a puzzle placement with missing required fields: POST request to `/api/check`
  *  Check a puzzle placement with invalid characters: POST request to `/api/check`
  *  Check a puzzle placement with incorrect length: POST request to `/api/check`
  *  Check a puzzle placement with invalid placement coordinate: POST request to `/api/check`
  *  Check a puzzle placement with invalid placement value: POST request to `/api/check`

