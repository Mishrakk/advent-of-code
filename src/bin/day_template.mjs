#!/usr/bin/env node
import { getRlInterface } from "../../shared/fileReader.mjs";
import assert from "assert";

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
  }
  return score;
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
  }
  return score;
}

export async function main() {
  console.log(`Hello from day${day}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 0);
  //const input2Part1Result = await solvePartOne("input2.txt");
  //assert.strictEqual(input2Part1Result, 0);
  //const input1Part2Result = await solvePartTwo("input1.txt");
  //assert.strictEqual(input1Part2Result, 0);
  //const input2Part2Result = await solvePartTwo("input2.txt");
  //assert.strictEqual(input2Part2Result, 0);
}
