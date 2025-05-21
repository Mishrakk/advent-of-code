import { readFileTo2DArray } from "@shared/fileReader";
import { getPosition, printGrid } from "@shared/grid";
import assert from "assert";

interface Position {
  i: number;
  j: number;
  direction?: string;
  path?: Position[];
  cost?: number;
}

const DIRECTIONS = ["^", ">", "v", "<"];

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const grid = readFileTo2DArray(filename);
  const startingPosition = getPosition(grid, "S")!;
  const distances = findDistances(grid, startingPosition);
  const endingPosition = getPosition(grid, "E")!;
  const endingPositionKey = `${endingPosition.i},${endingPosition.j}`;
  return distances[endingPositionKey];
}

function findDistances(grid: string[][], startingPosition: Position) {
  const visited = new Set();
  const distances: { [key: string]: number } = {};
  const queue = [{ ...startingPosition, cost: 0, direction: ">" }];
  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const position = queue.shift()!;
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
  grid: string[][],
  startingPosition: Position,
  endingPosition: Position,
  bestPathCost: number
) {
  const distances: { [key: string]: number } = {};
  const queue = [
    { ...startingPosition, cost: 0, direction: ">", path: [] as Position[] },
  ];
  const nodesOnBestPaths = new Set();
  while (queue.length > 0) {
    const position = queue.pop()!;
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
        path: [] as Position[],
      };
      if (isLegalPosition(grid, newPosition)) {
        newPosition.path = [...position.path];
        queue.push(newPosition);
      }
    }
  }
  return nodesOnBestPaths;
}

function getNewPosition(position: Position, direction: string) {
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

function isLegalPosition(grid: string[][], position: Position) {
  return grid[position.i][position.j] !== "#";
}

function getPositionKey(position: Position) {
  return `${position.i},${position.j},${position.direction}`;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const grid = readFileTo2DArray(filename);
  const startingPosition = getPosition(grid, "S")!;
  const endingPosition = getPosition(grid, "E")!;
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

export async function main() {
  console.log(`Hello from day16!`);
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
