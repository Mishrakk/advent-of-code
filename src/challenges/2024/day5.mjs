#!/usr/bin/env node
import { getRlInterface } from "../../shared/fileReader.mjs";
import assert from "assert";

const DAY = 5;

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(DAY, filename);
  let rules = [];

  let middleSum = 0;
  for await (const line of rl) {
    const pattern = /(\d+)\|(\d+)/;
    const match = line.match(pattern);
    if (match) {
      const firstNumber = match[1];
      const secondNumber = match[2];
      rules.push([firstNumber, secondNumber]);
    } else if (line.length > 0) {
      const updateValid = isUpdateValid(line, rules);
      if (updateValid) {
        const numbers = line.split(",");
        const middleIndex = Math.floor(numbers.length / 2);
        middleSum += parseInt(numbers[middleIndex]);
      }
    }
  }
  console.log("Middle sum:", middleSum);
  return middleSum;
}

function isUpdateValid(update, rules) {
  for (const rule of rules) {
    const updateInvalidPattern = new RegExp(`${rule[1]},.*${rule[0]}`);
    if (update.match(updateInvalidPattern)) {
      return false;
    }
  }
  return true;
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(DAY, filename);

  let rules = [];
  let middleSum = 0;
  for await (const line of rl) {
    const pattern = /(\d+)\|(\d+)/;
    const match = line.match(pattern);
    if (match) {
      const firstNumber = match[1];
      const secondNumber = match[2];
      rules.push([firstNumber, secondNumber]);
    } else if (line.length > 0) {
      const updateValid = isUpdateValid(line, rules);
      if (!updateValid) {
        let correctedUpdate = correctUpdate(line, rules);
        while (!isUpdateValid(correctedUpdate, rules)) {
          correctedUpdate = correctUpdate(correctedUpdate, rules);
        }
        const numbers = correctedUpdate.split(",");
        const middleIndex = Math.floor(numbers.length / 2);
        middleSum += parseInt(numbers[middleIndex]);
      }
    }
  }
  console.log("Middle sum:", middleSum);
  return middleSum;
}

function correctUpdate(update, rules) {
  const numbers = update.split(",");
  const numbersObject = numbers.reduce((obj, value, index) => {
    obj[value] = index;
    return obj;
  }, {});
  for (const rule of rules) {
    if (numbersObject[rule[0]] > numbersObject[rule[1]]) {
      const temp = numbersObject[rule[0]];
      numbersObject[rule[0]] = numbersObject[rule[1]];
      numbersObject[rule[1]] = temp;
    }
  }
  const correctedNumbers = Object.entries(numbersObject)
    .sort((a, b) => a[1] - b[1])
    .map(([key]) => key)
    .join(",");
  return correctedNumbers;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 143);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 6041);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 123);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 4884);
}
