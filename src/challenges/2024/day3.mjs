#!/usr/bin/env node
import { getRlInterface, readFile } from "../../shared/fileReader.mjs";
import assert from "assert";

const DAY = 3;

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(DAY, filename);

  let sum = 0;

  for await (const line of rl) {
    sum += getSum(line);
  }
  console.log("Sum:", sum);
  return sum;
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);
  const fullText = readFile(DAY, filename);

  const combinedPattern = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

  let enabled = true;
  let sum = 0;
  for (const match of fullText.matchAll(combinedPattern)) {
    if (match[0] === "do()") {
      enabled = true;
    } else if (match[0] === "don't()") {
      enabled = false;
    } else if (enabled) {
      sum += match[1] * match[2];
    }
  }
  console.log("Sum:", sum);
  return sum;
}

function getSum(text) {
  let sum = 0;
  const pattern = /mul\((\d+),(\d+)\)/g;
  for (const match of text.matchAll(pattern)) {
    sum += match[1] * match[2];
  }
  return sum;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 161);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 185797128);
  const input1Part2Result = await solvePartTwo("input1_part2.txt");
  assert.strictEqual(input1Part2Result, 48);
  const input2Part2Result = await solvePartTwo("input2_part2.txt");
  assert.strictEqual(input2Part2Result, 89798695);
}
