import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    const batteries = line.split("").map(Number);
    const largest = findLargestNumber(batteries, 0);
    const secondLargest = findLargestNumber(batteries, largest.index + 1);
    score += largest.value * 10 + secondLargest.value;
  }
  return score;
}

function findLargestNumber(batteries: number[], startingIndex: number) {
  let largest = {
    value: 0,
    index: -1,
  };
  let secondLargest = {
    value: 0,
    index: -1,
  }
  for (let i = startingIndex; i < batteries.length; i++) {
    const current = batteries[i];
    if (current > largest.value) {
      secondLargest = { ...largest };
      largest = {
        value: current,
        index: i,
      }
    }
  }
  return startingIndex === 0 && largest.index == batteries.length - 1 ? secondLargest : largest;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    const batteries = line.split("").map(Number);
    let startingIndex = 0;
    for (let i = 11; i >= 0; i--) {
      const largest = findLargestNumberWithSpareNumbers(batteries, startingIndex, i);
      startingIndex = largest.index +1;
      score += largest.value * Math.pow(10, i);
    }
  }
  return score;
}

function findLargestNumberWithSpareNumbers(batteries: number[], startingIndex: number, spareNumbers: number) {
  let largest = {
    value: 0,
    index: -1,}
  for (let i = startingIndex; i < batteries.length; i++) {
    if (i + spareNumbers >= batteries.length) {
      break;
    }
    const current = batteries[i];
    if (current > largest.value) {
      largest = {
        value: current,
        index: i,
      }
    }
  }
  return largest;
}

export async function main() {
  console.log(`Hello from day3!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 357);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 17321);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 3121910778619);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 171989894144198);
}
