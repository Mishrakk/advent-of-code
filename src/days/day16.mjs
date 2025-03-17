#!/usr/bin/env node
import { readFileTo2DArray } from "../shared/fileReader.mjs";
import { getPosition, printGrid } from "../shared/grid.mjs";
import assert from "assert";

const DAY = 16;

const DIRECTIONS = ["^", ">", "v", "<"];

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const grid = readFileTo2DArray(DAY, filename);
  const startingPosition = getPosition(grid, "S");
  const distances = findDistances(grid, startingPosition);
  const endingPosition = getPosition(grid, "E");
  const endingPositionKey = `${endingPosition.i},${endingPosition.j}`;
  return distances[endingPositionKey];
}

function findDistances(grid, startingPosition) {
  const visited = new Set();
  const distances = {};
  const queue = [{ ...startingPosition, cost: 0, direction: ">" }];
  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const position = queue.shift();
    const positionKey = getPositionKey(position);
    if (visited.has(positionKey)) {
      continue;
    }
    visited.add(positionKey);

    const distancesKey = `${position.i},${position.j}`;
    if (!distances[distancesKey] || distances[distancesKey] > position.cost) {
      distances[distancesKey] = position.cost;
    }

    for (const newDirectionChange of [-1, 0, 1]) {
      const newDirection =
        DIRECTIONS[
          (DIRECTIONS.indexOf(position.direction) +
            newDirectionChange +
            DIRECTIONS.length) %
            DIRECTIONS.length
        ];
      const newPosition = {
        ...getNewPosition(position, newDirection),
        direction: newDirection,
        cost:
          newDirection === position.direction
            ? position.cost + 1
            : position.cost + 1001,
      };
      if (isLegalPosition(grid, newPosition)) {
        queue.push(newPosition);
      }
    }
  }
  return distances;
}

function findNodesOnBestPaths(
  grid,
  startingPosition,
  endingPosition,
  bestPathCost
) {
  const visited = new Set();
  const distances = {};
  const queue = [{ ...startingPosition, cost: 0, direction: ">", path: [] }];
  const nodesOnBestPaths = new Set();
  while (queue.length > 0) {
    //queue.sort((a, b) => a.cost - b.cost);
    const position = queue.pop();
    //printGridWithPosition(grid, position);
    position.path.push({ i: position.i, j: position.j });
    const distancesKey = `${position.i},${position.j},${position.direction}`;

    if (
      nodesOnBestPaths.has(distancesKey) &&
      distances[distancesKey] &&
      distances[distancesKey] === position.cost
    ) {
      position.path.forEach((node) => {
        nodesOnBestPaths.add(`${node.i},${node.j}`);
      });
      continue;
    }

    if (!distances[distancesKey] || distances[distancesKey] > position.cost) {
      distances[distancesKey] = position.cost;
    }

    if (position.cost > distances[distancesKey]) {
      continue;
    }

    if (
      position.i === endingPosition.i &&
      position.j === endingPosition.j &&
      position.cost <= bestPathCost
    ) {
      position.path.forEach((node) => {
        nodesOnBestPaths.add(`${node.i},${node.j}`);
      });
      continue;
    }

    if (position.cost > bestPathCost) {
      continue;
    }

    // console.log(
    //   "position",
    //   `${position.i},${position.j},${position.direction}`
    // );

    // const visitedKey = `${position.i},${position.j},${position.direction}`;
    // if (visited.has(visitedKey)) {
    //   continue;
    // }
    // visited.add(visitedKey);

    for (const newDirectionChange of [-1, 0, 1]) {
      const newDirection =
        DIRECTIONS[
          (DIRECTIONS.indexOf(position.direction) +
            newDirectionChange +
            DIRECTIONS.length) %
            DIRECTIONS.length
        ];
      const newPosition = {
        ...getNewPosition(position, newDirection),
        direction: newDirection,
        cost:
          newDirection === position.direction
            ? position.cost + 1
            : position.cost + 1001,
      };
      if (isLegalPosition(grid, newPosition)) {
        newPosition.path = [...position.path];
        queue.push(newPosition);
      }
    }
  }
  return nodesOnBestPaths;
}

function getNewPosition(position, direction) {
  let i = position.i;
  let j = position.j;
  switch (direction) {
    case "^":
      i -= 1;
      break;
    case "v":
      i += 1;
      break;
    case "<":
      j -= 1;
      break;
    case ">":
      j += 1;
      break;
  }
  return {
    i,
    j,
  };
}

function isLegalPosition(grid, position) {
  return grid[position.i][position.j] !== "#";
}

function getPositionKey(position) {
  return `${position.i},${position.j},${position.direction}`;
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const grid = readFileTo2DArray(DAY, filename);
  const startingPosition = getPosition(grid, "S");
  const endingPosition = getPosition(grid, "E");
  const distances = findDistances(grid, startingPosition);
  const bestPathCost = distances[`${endingPosition.i},${endingPosition.j}`];
  const nodesOnBestPaths = findNodesOnBestPaths(
    grid,
    startingPosition,
    endingPosition,
    bestPathCost
  );
  return nodesOnBestPaths.size;
}

function printGridWithNodesOnBestPaths(grid, nodesOnBestPaths) {
  const gridCopy = grid.map((row) => [...row]);
  for (let i = 0; i < gridCopy.length; i++) {
    for (let j = 0; j < gridCopy[i].length; j++) {
      if (nodesOnBestPaths.has(`${i},${j}`)) {
        gridCopy[i][j] = "O";
      }
    }
  }
  printGrid(gridCopy);
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 7036);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 11048);
  const input3Part1Result = await solvePartOne("input3.txt");
  assert.strictEqual(input3Part1Result, 101492);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 45);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 64);
  const input3Part2Result = await solvePartTwo("input3.txt");
  assert.strictEqual(input3Part2Result, 543);
}
