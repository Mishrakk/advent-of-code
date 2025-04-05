import { getRlInterface } from "../../shared/fileReader";
import assert from "assert";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    const number = parseInt(line, 10);
    const [secret] = get2000thSecretNumber(number);
    score += secret;
  }
  return score;
}

function getNextSecretNumber(number: number) {
  const step1 = ((number ^ (number * 64)) >>> 0) % 16777216;
  const step2 = ((step1 ^ Math.floor(step1 / 32)) >>> 0) % 16777216;
  const secret = ((step2 ^ (step2 * 2048)) >>> 0) % 16777216;
  return secret;
}

function get2000thSecretNumber(number: number) {
  const digits = [number % 10];
  for (let i = 0; i < 2000; i++) {
    number = getNextSecretNumber(number);
    digits.push(number % 10);
  }
  return [number, ...digits];
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  const totalSequences: { [key: string]: number } = {};

  for await (const line of rl) {
    const number = parseInt(line, 10);
    const [, ...digits] = get2000thSecretNumber(number);
    const sequences: { [key: string]: number } = {};
    const diffs = [
      Infinity,
      digits[1] - digits[0],
      digits[2] - digits[1],
      digits[3] - digits[2],
    ];
    for (let i = 4; i < digits.length; i++) {
      diffs.shift();
      diffs.push(digits[i] - digits[i - 1]);
      const sequence = diffs.join(",");
      if (!sequences[sequence]) {
        sequences[sequence] = digits[i];
      }
    }
    for (const key in sequences) {
      if (!totalSequences[key]) {
        totalSequences[key] = 0;
      }
      totalSequences[key] += sequences[key];
    }
  }
  let score = 0;
  for (const key in totalSequences) {
    if (totalSequences[key] > score) {
      score = totalSequences[key];
    }
  }
  return score;
}

export async function main() {
  console.log(`Hello from day22!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 37327623);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 12979353889);
  const input1Part2Result = await solvePartTwo("input3.txt");
  assert.strictEqual(input1Part2Result, 23);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 1449);
}
