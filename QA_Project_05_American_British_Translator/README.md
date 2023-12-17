# freeCodeCamp - Quality Assurance - Projects - V - American British Translator


## 5. Projects - American British Translator

This is the boilerplate for the Sudoku Solver project. Instructions to complete your project can be found at [https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver)

Build a full stack JavaScript app that is functionally similar to this: [https://american-british-translator.freecodecamp.rocks/](https://american-british-translator.freecodecamp.rocks/). Working on this project will involve you writing your code using one of the following methods:

  *  Clone [this GitHub repo](https://github.com/freeCodeCamp/boilerplate-project-american-british-english-translator) and complete your project locally.
  *  Use [our Replit starter project](https://replit.com/github/freeCodeCamp/boilerplate-project-american-british-english-translator) to complete your project.
  *  Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

  *  Start by importing the project on Replit.
  *  Next, you will see a `.replit` window.
  *  Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the Solution Link field. Optionally, also submit a link to your project's source code in the GitHub Link field.

  *  All logic can go into `/components/translator.js`
  *  Complete the `/api/translate` route in `/routes/api.js`
  *  Create all of the unit/functional tests in `tests/1_unit-tests.js` and `tests/2_functional-tests.js`
  *  See the JavaScript files in `/components` for the different spelling and terms your application should translate
  *  To run the tests on Replit, set `NODE_ENV` to `test` without quotes in the `.env` file
  *  To run the tests in the console, use the command `npm run test`. To open the Replit console, press Ctrl+Shift+P (Cmd if on a Mac) and type "open shell"

Write the following tests in `tests/1_unit-tests.js`:

  *  Translate `Mangoes are my favorite fruit.` to British English
  *  Translate `I ate yogurt for breakfast.` to British English
  *  Translate `We had a party at my friend's condo.` to British English
  *  Translate `Can you toss this in the trashcan for me?` to British English
  *  Translate `The parking lot was full.` to British English
  *  Translate `Like a high tech Rube Goldberg machine.` to British English
  *  Translate `To play hooky means to skip class or work.` to British English
  *  Translate `No Mr. Bond, I expect you to die.` to British English
  *  Translate `Dr. Grosh will see you now.` to British English
  *  Translate `Lunch is at 12:15 today.` to British English
  *  Translate `We watched the footie match for a while.` to American English
  *  Translate `Paracetamol takes up to an hour to work.` to American English
  *  Translate `First, caramelise the onions.` to American English
  *  Translate `I spent the bank holiday at the funfair.` to American English
  *  Translate `I had a bicky then went to the chippy.` to American English
  *  Translate `I've just got bits and bobs in my bum bag.` to American English
  *  Translate `The car boot sale at Boxted Airfield was called off.` to American English
  *  Translate `Have you met Mrs Kalyani?` to American English
  *  Translate `Prof Joyner of King's College, London.` to American English
  *  Translate `Tea time is usually around 4 or 4.30.` to American English
  *  Highlight translation in `Mangoes are my favorite fruit.`
  *  Highlight translation in `I ate yogurt for breakfast.`
  *  Highlight translation in `We watched the footie match for a while.`
  *  Highlight translation in `Paracetamol takes up to an hour to work.`

Write the following tests in `tests/2_functional-tests.js`:

  *  Translation with text and locale fields: POST request to `/api/translate`
  *  Translation with text and invalid locale field: POST request to `/api/translate`
  *  Translation with missing text field: POST request to `/api/translate`
  *  Translation with missing locale field: POST request to `/api/translate`
  *  Translation with empty text: POST request to `/api/translate`
  *  Translation with text that needs no translation: POST request to `/api/translate`