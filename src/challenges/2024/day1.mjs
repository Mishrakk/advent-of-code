#!/usr/bin/env node
import assert from "assert";
import { getRlInterface } from "../../shared/fileReader.mjs";

const DAY = 1;

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);
  const list1 = [];
  const list2 = [];

  const rl = getRlInterface(DAY, filename);

  for await (const line of rl) {
    const [value1, value2] = line.split("   ");
    list1.push(value1);
    list2.push(value2);
  }

  list1.sort();
  list2.sort();
  const distance = list1.reduce(
    (acc, val, i) => acc + Math.abs(val - list2[i]),
    0
  );

  console.log("Total distance:", distance);
  return distance;
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);
  const list1 = [];
  const list2 = [];

  const rl = getRlInterface(DAY, filename);

  for await (const line of rl) {
    const [value1, value2] = line.split("   ");
    list1.push(value1);
    list2.push(value2);
  }

  const occurrences1 = countOccurrences(list1);
  const occurrences2 = countOccurrences(list2);

  let similarity = 0;
  Object.keys(occurrences1).forEach((key) => {
    similarity += key * occurrences1[key] * (occurrences2[key] || 0);
  });

  console.log("Similarity score:", similarity);
  return similarity;
}

function countOccurrences(numbers) {
  const occurrences = {};
  numbers.forEach((number) => {
    occurrences[number] = (occurrences[number] || 0) + 1;
  });
  return occurrences;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 11);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 1258579);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 31);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 23981443);
}
