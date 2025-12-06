import assert from "assert";
import { getRlInterface, readFileTo2DArray } from "@shared/fileReader";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const inputs = [];

  for await (const line of rl) {
    const processedLine = line.replace(/\s+/g, " ").trim();
    const parts = processedLine.split(" ");
    inputs.push(parts);
  }
  const operatorIndex = inputs.length - 1;
  for (let i = 0; i < inputs[0].length; i++) {
    const operands = getOperands(inputs, i, operatorIndex);
    const operator = inputs[operatorIndex][i];
    if (operator === "+") {
      score += operands.reduce((a, b) => a + Number(b), 0);
    } else if (operator === "*") {
      score += operands.reduce((a, b) => a * Number(b), 1);
    }
  }
  return score;
}

function getOperands(inputs: string[][], index: number, operatorIndex: number) {
  const operands: number[] = [];
  for (let i = 0; i < operatorIndex; i++) {
    operands.push(Number(inputs[i][index]));
  }
  return operands;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const inputs = readFileTo2DArray(filename);
  inputs.pop(); // last row is empty due to trailing newline
  const operators = inputs.pop()?.filter((v) => v !== " ") || [];
  const numberOfColumns = operators.length;
  let currentColumn = 0;
  let numbersInCurrentColumn: number[] = [];
  for (let i = 0; i < inputs[0].length; i++) {
    let value = "";
    for (let j = 0; j < inputs.length; j++) {
      value += inputs[j][i];
    }
    value = value.trim();
    if (i === inputs[0].length - 1) {
      numbersInCurrentColumn.push(Number(value));
      value = "";
    }
    if (value === "") {
      const operator = operators[currentColumn];
      if (operator === "+") {
        score += numbersInCurrentColumn.reduce((a, b) => a + Number(b), 0);
      } else if (operator === "*") {
        score += numbersInCurrentColumn.reduce((a, b) => a * Number(b), 1);
      }
      currentColumn++;
      numbersInCurrentColumn = [];
      continue;
    } else {
      numbersInCurrentColumn.push(Number(value));
    }
  }
  return score;
}

export async function main() {
  console.log(`Hello from day6!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 4277556);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 6757749566978);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 3263827);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 10603075273949);
}
