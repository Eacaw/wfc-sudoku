# Wave Function Collapse - Soduku Solver
## Web app

This app implements the wave function collapse algorithm to solve soduku's that are set on the board. It is a simple standalone static React site, that you can clone and run locally. 

## Setup

- Clone the repository locally
- `cd` into the repository
- run `npm start`
- navigate to `localhost:3000` to view the sudoku board and solve the puzzle

## Changing the puzzle

There are a number of exisitng puzzle options with varying difficulty levels available inside `/src/SodukuPuzzles.js` that are laid out in a two dimensional int array, with 0 representing and empty space on the baord, i.e.

```javascript
export const easy = [
  [0, 8, 0, 5, 6, 1, 7, 3, 4],
  [1, 4, 0, 7, 0, 0, 0, 0, 0],
  [7, 6, 0, 0, 9, 0, 5, 0, 0],
  [0, 0, 0, 0, 0, 3, 4, 0, 0],
  [2, 0, 4, 0, 0, 0, 8, 0, 3],
  [5, 3, 0, 4, 0, 0, 0, 2, 7],
  [0, 9, 7, 1, 0, 0, 2, 0, 0],
  [6, 2, 8, 9, 0, 0, 3, 5, 1],
  [4, 5, 0, 0, 2, 0, 6, 7, 9],
];
``` 
Once you have your new puzzle array set up, you can then import it on line 11 in `App.js` and update the puzzle const on line 17, which will feed your puzzle array through to the application. 

<img width="484" alt="Screenshot 2022-08-25 at 08 48 46" src="https://user-images.githubusercontent.com/24251551/186606722-df531136-48ee-4e75-9539-aee4766eac41.png">

## Planned updates

- Update the UI to include puzzle input for the client
- Make the UI actually palateable 
- Fix the issue with more sparesely populated boards
  - Minor update on this, debugging looks like it's related to the state stack not being properly filled, and the depth first search isn't being completed correctly, further investigation/planning required. 
- Refactor such that the algorithm can be lifted out into another application.
