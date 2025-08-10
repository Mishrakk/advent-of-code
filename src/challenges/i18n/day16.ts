import assert from "assert";
import { readFileTo2DArray } from "@shared/fileReader";
import { deepCopyGrid } from "@shared/grid";

interface Pipe {
  rotations: number;
  nextSymbol: string;
  requirements: { top: number; bottom: number; left: number; right: number };
}

// prettier-ignore
const PIPES: Record<string, Pipe> = {
  " ": { rotations: 1, nextSymbol: " ", requirements: { top: 0, bottom: 0, left: 0, right: 0 }},
  "┼": { rotations: 1, nextSymbol: "┼", requirements: { top: 1, bottom: 1, left: 1, right: 1 }},
  "╬": { rotations: 1, nextSymbol: "╬", requirements: { top: 2, bottom: 2, left: 2, right: 2 }},

  "─": { rotations: 2, nextSymbol: "│", requirements: { top: 0, bottom: 0, left: 1, right: 1 }},
  "│": { rotations: 2, nextSymbol: "─", requirements: { top: 1, bottom: 1, left: 0, right: 0 }},
  "═": { rotations: 2, nextSymbol: "║", requirements: { top: 0, bottom: 0, left: 2, right: 2 }},
  "║": { rotations: 2, nextSymbol: "═", requirements: { top: 2, bottom: 2, left: 0, right: 0 }},

  "╪": { rotations: 2, nextSymbol: "╫", requirements: { top: 1, bottom: 1, left: 2, right: 2 }},
  "╫": { rotations: 2, nextSymbol: "╪", requirements: { top: 2, bottom: 2, left: 1, right: 1 }},

  "└": { rotations: 4, nextSymbol: "┌", requirements: { top: 1, bottom: 0, left: 0, right: 1 }},
  "┌": { rotations: 4, nextSymbol: "┐", requirements: { top: 0, bottom: 1, left: 0, right: 1 }},
  "┐": { rotations: 4, nextSymbol: "┘", requirements: { top: 0, bottom: 1, left: 1, right: 0 }},
  "┘": { rotations: 4, nextSymbol: "└", requirements: { top: 1, bottom: 0, left: 1, right: 0 }},

  "┬": { rotations: 4, nextSymbol: "┤", requirements: { top: 0, bottom: 1, left: 1, right: 1 }},
  "┤": { rotations: 4, nextSymbol: "┴", requirements: { top: 1, bottom: 1, left: 1, right: 0 }},
  "┴": { rotations: 4, nextSymbol: "├", requirements: { top: 1, bottom: 0, left: 1, right: 1 }},
  "├": { rotations: 4, nextSymbol: "┬", requirements: { top: 1, bottom: 1, left: 0, right: 1 }},
  
  "╚": { rotations: 4, nextSymbol: "╔", requirements: { top: 2, bottom: 0, left: 0, right: 2 }},
  "╔": { rotations: 4, nextSymbol: "╗", requirements: { top: 0, bottom: 2, left: 0, right: 2 }},
  "╗": { rotations: 4, nextSymbol: "╝", requirements: { top: 0, bottom: 2, left: 2, right: 0 }},
  "╝": { rotations: 4, nextSymbol: "╚", requirements: { top: 2, bottom: 0, left: 2, right: 0 }},

  "╦": { rotations: 4, nextSymbol: "╣", requirements: { top: 0, bottom: 2, left: 2, right: 2 }},
  "╣": { rotations: 4, nextSymbol: "╩", requirements: { top: 2, bottom: 2, left: 2, right: 0 }},
  "╩": { rotations: 4, nextSymbol: "╠", requirements: { top: 2, bottom: 0, left: 2, right: 2 }},
  "╠": { rotations: 4, nextSymbol: "╦", requirements: { top: 2, bottom: 2, left: 0, right: 2 }},

  "╞": { rotations: 4, nextSymbol: "╥", requirements: { top: 1, bottom: 1, left: 0, right: 2 }},
  "╥": { rotations: 4, nextSymbol: "╡", requirements: { top: 0, bottom: 2, left: 1, right: 1 }},
  "╡": { rotations: 4, nextSymbol: "╨", requirements: { top: 1, bottom: 1, left: 2, right: 0 }},
  "╨": { rotations: 4, nextSymbol: "╞", requirements: { top: 2, bottom: 0, left: 1, right: 1 }},
  
  "╟": { rotations: 4, nextSymbol: "╤", requirements: { top: 2, bottom: 2, left: 0, right: 1 }},
  "╤": { rotations: 4, nextSymbol: "╢", requirements: { top: 0, bottom: 1, left: 2, right: 2 }},
  "╢": { rotations: 4, nextSymbol: "╧", requirements: { top: 2, bottom: 2, left: 1, right: 0 }},
  "╧": { rotations: 4, nextSymbol: "╟", requirements: { top: 1, bottom: 0, left: 2, right: 2 }},
};

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const grid = readFileTo2DArray(filename);
  const score = solveGrid(grid, 0).rotations;
  return score;
}

function solveGrid(
  grid: string[][],
  currentElementIndex: number
): { success: boolean; rotations: number } {
  let rotations = 0;

  for (
    let index = currentElementIndex;
    index < grid.length * grid[0].length;
    index++
  ) {
    const { i, j } = getPosition(grid, index);
    const symbol = grid[i][j];
    if (symbol === " ") {
      continue;
    }
    const pipe = getPipe(symbol);
    if (pipe.rotations === 1) {
      continue;
    }
    const solutions = [];
    // Try each possible rotation
    for (let rotation = 0; rotation < pipe.rotations; rotation++) {
      if (rotation > 0) {
        rotations++;
        // Rotate the pipe
        const currentSymbol = grid[i][j];
        const nextSymbol = getPipe(currentSymbol).nextSymbol;
        grid[i][j] = nextSymbol;
      }

      if (isValidRotation(grid, i, j)) {
        const result = solveGrid(deepCopyGrid(grid), index + 1);
        if (result.success) {
          solutions.push({
            symbol: grid[i][j],
            rotations: result.rotations + rotations,
          });
        }
      }
    }
    if (solutions.length > 0) {
      // Sort solutions by number of rotations (ascending)
      solutions.sort((a, b) => a.rotations - b.rotations);
      // Take the solution with the minimum rotations
      const bestSolution = solutions[0];
      grid[i][j] = bestSolution.symbol;
      return { success: true, rotations: bestSolution.rotations };
    }

    return { success: false, rotations };
  }
  return { success: true, rotations };
}

function getPipe(symbol: string): Pipe {
  const pipe = PIPES[symbol];
  if (!pipe) {
    throw new Error(`Unknown pipe symbol: ${symbol}`);
  }
  return pipe;
}

function isValidRotation(grid: string[][], i: number, j: number) {
  const currentPipe = getPipe(grid[i][j]);
  const topRequirements =
    i === 0 && j === 0
      ? 1
      : i === 0
      ? 0
      : getPipe(grid[i - 1][j]).requirements.bottom;
  if (currentPipe.requirements.top != topRequirements) {
    return false;
  }

  const leftRequirements =
    j === 0 ? 0 : getPipe(grid[i][j - 1]).requirements.right;
  if (currentPipe.requirements.left != leftRequirements) {
    return false;
  }

  // Check bottom edge requirements
  if (i === grid.length - 1) {
    const expectedBottom = j === grid[0].length - 1 ? 1 : 0;
    if (currentPipe.requirements.bottom !== expectedBottom) {
      return false;
    }
  }

  // Check right edge requirements
  if (j === grid[0].length - 1) {
    const expectedRight = i === grid.length - 1 ? 0 : 0;
    if (currentPipe.requirements.right !== expectedRight) {
      return false;
    }
  }
  return true;
}

function getPosition(grid: string[][], index: number) {
  const cols = grid[0].length;
  const i = Math.floor(index / cols);
  const j = index % cols;
  return { i, j };
}

export async function main() {
  console.log(`Hello from day16!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 34);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 753);
}
