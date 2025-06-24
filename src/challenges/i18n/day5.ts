import assert from "assert";
import { readFileTo2DArray } from "@shared/fileReader";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  let score = 0;
  const grid = readFileTo2DArray(filename);
  const height = grid.length;
  const width = grid[0].length;
  let x = 0;
  for (let y = 0; y < height; y++) {
    if (grid[y][x] === "💩") {
      score++;
    }
    x = (x + 2) % width;
  }
  return score;
}

export async function main() {
  console.log(`Hello from day5!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 2);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 74);
}
