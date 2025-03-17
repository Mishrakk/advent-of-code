#!/usr/bin/env node
import { getAllNumbersInFile } from "../shared/fileReader.mjs";
import assert from "assert";

const DAY = 18;
const NEIGHBORS_VECTORS = [
  { i: -1, j: 0 }, // up
  { i: 1, j: 0 }, // down
  { i: 0, j: -1 }, // left
  { i: 0, j: 1 }, // right
];

function solvePartOne(filename, parameters) {
  console.log("Solving part one of file:", filename);

  const numbers = getAllNumbersInFile(DAY, filename);
  const grid = constructGrid(numbers, parameters);

  const startingPosition = { i: 0, j: 0 };
  const finishPosition = {
    i: parameters.gridSize - 1,
    j: parameters.gridSize - 1,
  };
  const distances = findDistances(grid, startingPosition);
  const score = distances[getPositionKey(finishPosition)];
  return score;
}

function constructGrid(numbers, parameters) {
  const grid = Array.from({ length: parameters.gridSize }, () =>
    Array(parameters.gridSize).fill(".")
  );
  for (let i = 0; i < 2 * parameters.bytesToTake; i += 2) {
    grid[numbers[i + 1]][numbers[i]] = "#";
  }
  return grid;
}

function findDistances(grid, startingPosition) {
  const visited = new Set();
  const distances = {};
  const queue = [{ ...startingPosition, cost: 0 }];
  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const position = queue.shift();
    const positionKey = getPositionKey(position);
    if (visited.has(positionKey)) {
      continue;
    }
    visited.add(positionKey);

    if (!distances[positionKey] || distances[positionKey] > position.cost) {
      distances[positionKey] = position.cost;
    }

    for (const vector of NEIGHBORS_VECTORS) {
      const neighbor = {
        i: position.i + vector.i,
        j: position.j + vector.j,
        cost: position.cost + 1,
      };

      if (
        neighbor.i >= 0 &&
        neighbor.i < grid.length &&
        neighbor.j >= 0 &&
        neighbor.j < grid[0].length &&
        grid[neighbor.i][neighbor.j] !== "#"
      ) {
        queue.push(neighbor);
      }
    }
  }
  return distances;
}

function getPositionKey(position) {
  return `${position.i},${position.j}`;
}

async function solvePartTwo(filename, parameters) {
  console.log("Solving part two of file:", filename);

  const numbers = getAllNumbersInFile(DAY, filename);
  let max = numbers.length / 2;
  let min = parameters.bytesToTake;

  while (max - min > 1) {
    const middle = Math.floor((max + min) / 2);
    const grid = constructGrid(numbers, {
      gridSize: parameters.gridSize,
      bytesToTake: middle,
    });
    if (isMazeSolvable(grid)) {
      min = middle;
    } else {
      max = middle;
    }
  }
  return `${numbers[min * 2]},${numbers[min * 2 + 1]}`;
}

function isMazeSolvable(grid) {
  const startingPosition = { i: 0, j: 0 };
  const finishPosition = { i: grid.length - 1, j: grid[0].length - 1 };
  const distances = findDistances(grid, startingPosition);
  return distances[getPositionKey(finishPosition)] !== undefined;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = solvePartOne("input1.txt", {
    gridSize: 7,
    bytesToTake: 12,
  });
  assert.strictEqual(input1Part1Result, 22);
  const input2Part1Result = solvePartOne("input2.txt", {
    gridSize: 71,
    bytesToTake: 1024,
  });
  assert.strictEqual(input2Part1Result, 270);
  const input1Part2Result = await solvePartTwo("input1.txt", {
    gridSize: 7,
    bytesToTake: 12,
  });
  assert.strictEqual(input1Part2Result, "6,1");
  const input2Part2Result = await solvePartTwo("input2.txt", {
    gridSize: 71,
    bytesToTake: 1024,
  });
  assert.strictEqual(input2Part2Result, "51,40");
}
