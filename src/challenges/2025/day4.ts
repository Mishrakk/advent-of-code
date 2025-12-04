import assert from "assert";
import { readFileTo2DArray } from "@shared/fileReader";
import { checkIfInBounds, getAllNeighbors } from "@shared/grid";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const grid = readFileTo2DArray(filename);
  let score = 0;
  const height = grid.length;
  const width = grid[0].length;
  const neighborsCount: Record<string, number> = {};

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j] === "@") {
        if (!neighborsCount[`${i},${j}`]) {
          neighborsCount[`${i},${j}`] = 0;
        }
        getAllNeighbors(i, j).forEach(({ i: ni, j: nj }) => {
          if (checkIfInBounds(grid, { i: ni, j: nj })) {
            const neighborKey = `${ni},${nj}`;
            if (!neighborsCount[neighborKey]) {
              neighborsCount[neighborKey] = 0;
            }
            neighborsCount[neighborKey]++;
          }
        });
      }
    }
  }

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j] === "@" && neighborsCount[`${i},${j}`] < 4) {
        score++;
      }
    }
  }
  return score;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const grid = readFileTo2DArray(filename);
  let score = 0;
  const height = grid.length;
  const width = grid[0].length;
  const neighborsCount: Record<string, number> = {};

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j] === "@") {
        if (!neighborsCount[`${i},${j}`]) {
          neighborsCount[`${i},${j}`] = 0;
        }
        getAllNeighbors(i, j).forEach(({ i: ni, j: nj }) => {
          if (checkIfInBounds(grid, { i: ni, j: nj }) && grid[ni][nj] === "@") {
            const neighborKey = `${ni},${nj}`;
            if (!neighborsCount[neighborKey]) {
              neighborsCount[neighborKey] = 0;
            }
            neighborsCount[neighborKey]++;
          }
        });
      }
    }
  }

  let scoreChanged = false;

  while (true) {
    scoreChanged = false;
    for (const key of Object.keys(neighborsCount)) {
      if (neighborsCount[key] < 4) {
        // here we will remove this node and update neighborsCount
        const [i, j] = key.split(",").map(Number);
        delete neighborsCount[key];
        score++;
        scoreChanged = true;
        getAllNeighbors(i, j).forEach(({ i: ni, j: nj }) => {
          const neighborKey = `${ni},${nj}`;
          if (neighborsCount[neighborKey] !== undefined) {
            neighborsCount[neighborKey]--;
          }
        });
      }
    }
    if (!scoreChanged) {
      break;
    }
  }

  return score;
}

export async function main() {
  console.log(`Hello from day4!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 13);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 1478);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 43);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 9120);
}
