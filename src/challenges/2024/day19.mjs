#!/usr/bin/env node
import { getRlInterface } from "../../shared/fileReader.mjs";
import assert from "assert";

const cache = new Map();

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  const towels = [];
  let score = 0;
  cache.clear();

  for await (const line of rl) {
    if (towels.length === 0) {
      towels.push(...line.split(", "));
      continue;
    }
    if (
      line.length !== 0 &&
      getNumberOfWaysPatternCanBeConstructed(line, towels) > 0
    ) {
      score++;
    }
  }
  return score;
}

function getNumberOfWaysPatternCanBeConstructed(pattern, towels) {
  if (cache.has(pattern)) {
    return cache.get(pattern);
  }
  let numberOfWays = 0;
  for (const towel of towels) {
    if (pattern === towel) {
      numberOfWays++;
    } else if (pattern.startsWith(towel)) {
      const rest = pattern.substring(towel.length);
      numberOfWays += getNumberOfWaysPatternCanBeConstructed(rest, towels);
    }
  }
  cache.set(pattern, numberOfWays);
  return numberOfWays;
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  const towels = [];
  let score = 0;
  cache.clear();

  for await (const line of rl) {
    if (towels.length === 0) {
      towels.push(...line.split(", "));
    } else if (line.length !== 0) {
      score += getNumberOfWaysPatternCanBeConstructed(line, towels);
    }
  }
  return score;
}

export async function main() {
  console.log(`Hello from day19!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 6);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 251);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 16);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 616957151871345);
}
