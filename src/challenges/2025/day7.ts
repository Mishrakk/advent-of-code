import assert from "assert";
import { readFile } from "@shared/fileReader";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);
  let score = 0;

  const grid = readFile(filename).split("\n");
  let beams = new Map<number, boolean>();
  beams.set(grid[0].indexOf("S"), true);
  for (let i = 1; i < grid.length; i++) {
    const newBeams = new Map<number, boolean>();
    beams.forEach((_, x) => {
      if (grid[i][x] === ".") {
        newBeams.set(x, true);
      } else if (grid[i][x] === "^") {
        score++;
        newBeams.set(x - 1, true);
        newBeams.set(x + 1, true);
      }
    });
    beams = newBeams;
  }
  return score;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  let score = 1;

  const grid = readFile(filename).split("\n");
  let beams = new Map<number, number>();
  beams.set(grid[0].indexOf("S"), 1);
  for (let i = 1; i < grid.length; i++) {
    const newBeams = new Map<number, number>();
    beams.forEach((timelines, x) => {
      if (grid[i][x] === ".") {
        newBeams.set(x, timelines + (newBeams.get(x) || 0));
      } else if (grid[i][x] === "^") {
        newBeams.set(x - 1, timelines + (newBeams.get(x - 1) || 0));
        newBeams.set(x + 1, timelines + (newBeams.get(x + 1) || 0));
        score += timelines;
      }
    });
    beams = newBeams;
  }
  return score;
}

export async function main() {
  console.log(`Hello from day7!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 21);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 1592);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 40);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 17921968177009);
}
