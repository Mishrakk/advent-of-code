import { readFileTo2DArray } from "@shared/fileReader";
import { getPosition } from "@shared/grid";
import assert from "assert";

const NEIGHBORS_VECTORS = [
  { i: -1, j: 0 }, // up
  { i: 1, j: 0 }, // down
  { i: 0, j: -1 }, // left
  { i: 0, j: 1 }, // right
];

interface Position {
  i: number;
  j: number;
  cost: number;
}

async function solvePartOne(filename: string, minSave: number) {
  console.log("Solving part one of file:", filename);

  const grid = readFileTo2DArray(filename);
  const startingPosition = getPosition(grid, "S")! as Position;
  const distances = findDistances(grid, startingPosition);
  let score = 0;
  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[i].length - 1; j++) {
      if (grid[i][j] === "#") {
        if (isPath(grid[i][j - 1]) && isPath(grid[i][j + 1])) {
          //horizontal cheat
          const distance1 = distances[`${i},${j - 1}`];
          const distance2 = distances[`${i},${j + 1}`];
          const cheatScore = Math.abs(distance2 - distance1) - 1;
          if (cheatScore >= minSave) {
            score++;
          }
        }

        if (isPath(grid[i - 1][j]) && isPath(grid[i + 1][j])) {
          //vertical cheat
          const distance1 = distances[`${i - 1},${j}`];
          const distance2 = distances[`${i + 1},${j}`];
          const cheatScore = Math.abs(distance2 - distance1) - 1;
          if (cheatScore >= minSave) {
            score++;
          }
        }
      }
    }
  }
  return score;
}

function isPath(symbol: string) {
  return symbol === "." || symbol === "S" || symbol === "E";
}

function findDistances(grid: string[][], startingPosition: Position) {
  const visited = new Set();
  const distances: { [key: string]: number } = {};
  const queue = [{ ...startingPosition, cost: 0 }];
  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const position = queue.shift()!;
    const positionKey = `${position.i},${position.j}`;
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

async function solvePartTwo(filename: string, minSave: number) {
  console.log("Solving part two of file:", filename);
  const grid = readFileTo2DArray(filename);
  const startingPosition = getPosition(grid, "S")! as Position;
  const distances = findDistances(grid, startingPosition);
  let score = 0;
  const seenCheats = new Set();
  for (const [key, distance] of Object.entries(distances)) {
    const [p1i, p1j] = key.split(",").map(Number);
    for (let i = -20; i <= 20; i++) {
      const p2i = p1i + i;
      if (p2i < 0 || p2i >= grid.length) {
        continue;
      }
      const maxJ = 20 - Math.abs(i);
      for (let j = -maxJ; j <= maxJ; j++) {
        const p2j = p1j + j;
        if (p2j < 0 || p2j >= grid[0].length) {
          continue;
        }
        if (
          grid[p2i][p2j] === "#" ||
          seenCheats.has(`${p1i},${p1j},${p2i},${p2j}`)
        ) {
          continue;
        }
        seenCheats.add(`${p1i},${p1j},${p2i},${p2j}`);
        seenCheats.add(`${p2i},${p2j},${p1i},${p1j}`);
        const manhattanDistance = getManhattanDistance(p1i, p1j, p2i, p2j);
        const distance2 = distances[`${p2i},${p2j}`];
        if (Math.abs(distance2 - distance) - manhattanDistance >= minSave) {
          score++;
        }
      }
    }
  }
  return score;
}

function getManhattanDistance(
  p1i: number,
  p1j: number,
  p2i: number,
  p2j: number
) {
  return Math.abs(p1i - p2i) + Math.abs(p1j - p2j);
}

export async function main() {
  console.log(`Hello from day20!`);
  const input1Part1Result = await solvePartOne("input1.txt", 20);
  assert.strictEqual(input1Part1Result, 5);
  const input2Part1Result = await solvePartOne("input2.txt", 100);
  assert.strictEqual(input2Part1Result, 1448);
  const input1Part2Result = await solvePartTwo("input1.txt", 70);
  assert.strictEqual(input1Part2Result, 41);
  const input2Part2Result = await solvePartTwo("input2.txt", 100);
  assert.strictEqual(input2Part2Result, 1017615);
}
