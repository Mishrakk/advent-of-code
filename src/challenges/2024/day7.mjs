#!/usr/bin/env node
import { getRlInterface } from "../../shared/fileReader.mjs";
import assert from "assert";

const DAY = 7;

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(DAY, filename);
  let score = 0;

  const pattern = /(\d+)/g;
  for await (const line of rl) {
    const numbers = line.match(pattern).map(Number);
    if (canBeSolved(numbers)) {
      score += numbers[0];
    }
  }
  return score;
}

function canBeSolved(numbers, numberOfPossibleOperators = 2) {
  const expectedResult = numbers[0];
  const equationNumbers = numbers.slice(1);
  const limit = Math.pow(numberOfPossibleOperators, equationNumbers.length - 1);
  for (let i = 0; i < limit; i++) {
    const operators = i
      .toString(numberOfPossibleOperators)
      .padStart(equationNumbers.length - 1, "0");
    //console.log("expectedResult", expectedResult);
    if (expectedResult === getResult(equationNumbers, operators)) {
      return true;
    }
  }
  return false;
}

function getResult(numbers, operators) {
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    switch (operators[i]) {
      case "0":
        result += numbers[i + 1];
        break;
      case "1":
        result *= numbers[i + 1];
        break;
      case "2":
        result = parseInt(result.toString() + numbers[i + 1].toString(), 10);
        break;
    }
  }
  //visualize(numbers, operators, result);
  return result;
}

function visualize(numbers, operators, result) {
  let resultString = numbers[0].toString();
  for (let i = 0; i < operators.length; i++) {
    switch (operators[i]) {
      case "0":
        resultString += ` + ${numbers[i + 1]}`;
        break;
      case "1":
        resultString += ` * ${numbers[i + 1]}`;
        break;
      case "2":
        resultString += ` || ${numbers[i + 1]}`;
        break;
    }
  }
  resultString += ` = ${result}`;
  console.log(resultString);
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(DAY, filename);
  let score = 0;

  const pattern = /(\d+)/g;
  for await (const line of rl) {
    const numbers = line.match(pattern).map(Number);
    if (canBeSolved(numbers, 3)) {
      score += numbers[0];
    }
  }
  return score;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 3749);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 21572148763543);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 11387);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 581941094529163);
}
