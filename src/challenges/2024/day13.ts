import { readFile } from "@shared/fileReader";
import assert from "assert";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const file = readFile(filename);
  const numbers = file.match(/\d+/g)!.map(Number);
  let score = 0;
  for (let i = 0; i < numbers.length; i += 6) {
    let [a, b] = solveCramerRule(
      numbers[i],
      numbers[i + 2],
      numbers[i + 4],
      numbers[i + 1],
      numbers[i + 3],
      numbers[i + 5]
    );
    if (Math.abs(a - Math.round(a)) < 1e-2) {
      a = Math.round(a);
    }
    if (Math.abs(b - Math.round(b)) < 1e-2) {
      b = Math.round(b);
    }
    if (Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0) {
      score += 3 * a + b;
    }
  }
  return score;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const file = readFile(filename);
  const numbers = file.match(/\d+/g)!.map(Number);
  let score = 0;
  const conversionFactor = 10000000000000;
  for (let i = 0; i < numbers.length; i += 6) {
    let [a, b] = solveCramerRule(
      numbers[i],
      numbers[i + 2],
      numbers[i + 4] + conversionFactor,
      numbers[i + 1],
      numbers[i + 3],
      numbers[i + 5] + conversionFactor
    );
    if (Math.abs(a - Math.round(a)) < 1e-6) {
      a = Math.round(a);
    }
    if (Math.abs(b - Math.round(b)) < 1e-6) {
      b = Math.round(b);
    }
    if (Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0) {
      score += 3 * a + b;
    }
  }
  return score;
}

function solveCramerRule(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
) {
  const determinant = a1 * b2 - a2 * b1;
  const determinantX = c1 * b2 - c2 * b1;
  const determinantY = a1 * c2 - a2 * c1;
  const x = determinantX / determinant;
  const y = determinantY / determinant;
  return [x, y];
}

export async function main() {
  console.log(`Hello from day13!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 480);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 34393);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 875318608908);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 83551068361379);
}
