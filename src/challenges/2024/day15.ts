import { getRlInterface } from "../../shared/fileReader";
import assert from "assert";

interface Position {
  i: number;
  j: number;
}

interface Vector {
  i: number;
  j: number;
}

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const { instructions, grid } = await readInput(filename);

  let position = getStartingPosition(grid)!;
  for (const instruction of instructions) {
    const changeVector = getChangeVector(instruction);
    const trainLength = getTrainLength(grid, position, changeVector);
    if (trainLength === -1) {
      continue;
    }
    for (let i = trainLength; i > 0; i--) {
      let pos1 = {
        i: position.i + i * changeVector.i,
        j: position.j + i * changeVector.j,
      };
      let pos2 = {
        i: position.i + (i - 1) * changeVector.i,
        j: position.j + (i - 1) * changeVector.j,
      };
      const temp = grid[pos1.i][pos1.j];
      grid[pos1.i][pos1.j] = grid[pos2.i][pos2.j];
      grid[pos2.i][pos2.j] = temp;
    }
    position.i += changeVector.i;
    position.j += changeVector.j;
  }

  return getScore(grid);
}

async function readInput(filename: string) {
  const rl = getRlInterface(filename);
  const grid = [];
  const instructions = [];

  for await (const line of rl) {
    if (line[0] === "#") {
      const row = line.split("");
      grid.push(row);
    } else {
      instructions.push(...line.split(""));
    }
  }
  const scaledGrid = scaleUpWarehouse(grid);
  return { instructions, grid, scaledGrid };
}

function getScore(grid: string[][]) {
  let score = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "O" || grid[i][j] === "[") {
        score += i * 100 + j;
      }
    }
  }
  return score;
}

function getTrainLength(
  grid: string[][],
  originalPosition: Position,
  changeVector: Vector
) {
  const nextPosition = {
    i: originalPosition.i + changeVector.i,
    j: originalPosition.j + changeVector.j,
  };
  let trainLength = 1;
  while (
    nextPosition.i >= 0 &&
    nextPosition.i < grid.length &&
    nextPosition.j >= 0 &&
    nextPosition.j < grid[0].length
  ) {
    if (grid[nextPosition.i][nextPosition.j] === "#") {
      return -1;
    } else if (grid[nextPosition.i][nextPosition.j] === "O") {
      trainLength++;
      nextPosition.i += changeVector.i;
      nextPosition.j += changeVector.j;
    } else {
      break;
    }
  }
  return trainLength;
}

function getChangeVector(direction: string): Vector {
  switch (direction) {
    case "^":
      return { i: -1, j: 0 };
    case "v":
      return { i: 1, j: 0 };
    case "<":
      return { i: 0, j: -1 };
    case ">":
      return { i: 0, j: 1 };
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}

function getStartingPosition(grid: string[][]): Position {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "@") {
        return { i, j };
      }
    }
  }
  throw new Error("Starting position not found in the grid.");
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const { scaledGrid, instructions } = await readInput(filename);
  const position = { ...getStartingPosition(scaledGrid) };
  for (const instruction of instructions) {
    const changeVector = getChangeVector(instruction);
    const train = getAdvancedTrain(scaledGrid, position, changeVector);
    if (train.length === 0) {
      continue;
    }
    while (train.length > 0) {
      const trainPosition = train.pop();
      const temp = scaledGrid[trainPosition.i][trainPosition.j];
      scaledGrid[trainPosition.i][trainPosition.j] =
        scaledGrid[trainPosition.i + changeVector.i][
          trainPosition.j + changeVector.j
        ];
      scaledGrid[trainPosition.i + changeVector.i][
        trainPosition.j + changeVector.j
      ] = temp;
    }
    position.i += changeVector.i;
    position.j += changeVector.j;
  }
  return getScore(scaledGrid);
}

function scaleUpWarehouse(grid: string[][]) {
  const scaledUpGrid = [];
  for (let i = 0; i < grid.length; i++) {
    let newRow = [];
    for (let j = 0; j < grid[i].length; j++) {
      newRow.push(...getScaledUpSymbol(grid[i][j]));
    }
    scaledUpGrid.push(newRow);
  }
  return scaledUpGrid;
}

function getScaledUpSymbol(symbol: string) {
  switch (symbol) {
    case "#":
      return ["#", "#"];
    case "O":
      return ["[", "]"];
    case ".":
      return [".", "."];
    case "@":
      return ["@", "."];
    default:
      throw new Error(`Invalid symbol: ${symbol}`);
  }
}

function getAdvancedTrain(
  grid: string[][],
  originalPosition: Position,
  changeVector: Vector
) {
  const queue = [originalPosition];
  const visited = new Set();
  const stack: Position[] = [];
  while (queue.length > 0) {
    const position = queue.shift()!;
    if (visited.has(position)) {
      continue;
    }
    visited.add(position);
    if (!stack.some((pos) => pos.i === position.i && pos.j === position.j)) {
      stack.push(position);
    }
    const nextPosition = {
      i: position.i + changeVector.i,
      j: position.j + changeVector.j,
    };
    const nextPositionSymbol = grid[nextPosition.i][nextPosition.j];
    if (nextPositionSymbol === "#") {
      return [];
    } else if (
      (nextPositionSymbol === "[" && changeVector.j !== -1) ||
      (nextPositionSymbol === "]" && changeVector.j !== 1)
    ) {
      queue.push(nextPosition);
      queue.push(getSiblingPosition(grid, nextPosition));
    }
  }
  return stack;
}

function getSiblingPosition(grid: string[][], position: Position) {
  const symbol = grid[position.i][position.j];
  if (symbol === "[") {
    return { i: position.i, j: position.j + 1 };
  } else if (symbol === "]") {
    return { i: position.i, j: position.j - 1 };
  } else {
    throw new Error(
      `Tried looking for sibling of ${symbol} at ${position.i}, ${position.j}`
    );
  }
}

export async function main() {
  console.log(`Hello from day15!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 2028);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 10092);
  const input3Part1Result = await solvePartOne("input3.txt");
  assert.strictEqual(input3Part1Result, 1497888);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 1751);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 9021);
  const input3Part2Result = await solvePartTwo("input3.txt");
  assert.strictEqual(input3Part2Result, 1522420);
}
