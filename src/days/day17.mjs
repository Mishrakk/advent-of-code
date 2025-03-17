#!/usr/bin/env node
import { readFile } from "../shared/fileReader.mjs";
import assert from "assert";

const DAY = 17;

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const file = readFile(DAY, filename);
  const { registers, program } = getInput(file);
  const output = runProgram(registers, program);

  return output.join(",");
}

function runProgram(registers, program) {
  const output = [];
  for (let i = 0; i < program.length; ) {
    const instruction = program[i];
    const operand = program[i + 1];
    i += 2;
    logState(instruction, operand, registers);
    switch (instruction) {
      case 0: // adv
        registers.a = Math.floor(
          registers.a / Math.pow(2, getComboOperand(operand, registers))
        );
        break;
      case 1: // bxl
        registers.b = (registers.b ^ operand) >>> 0;
        break;
      case 2: // bst
        registers.b = getComboOperand(operand, registers) % 8;
        break;
      case 3: // jnz
        if (registers.a !== 0) {
          i = operand;
        }
        break;
      case 4: // bxc
        registers.b = (registers.b ^ registers.c) >>> 0;
        break;
      case 5: // out
        output.push(getComboOperand(operand, registers) % 8);
        break;
      case 6: // bdv
        registers.b = Math.floor(
          registers.a / Math.pow(2, getComboOperand(operand, registers))
        );
        break;
      case 7: // cdv
        registers.c = Math.floor(
          registers.a / Math.pow(2, getComboOperand(operand, registers))
        );
        break;
    }
  }
  return output;
}

function logState(instruction, operand, registers) {
  const instructions = {
    0: "adv",
    1: "bxl",
    2: "bst",
    3: "jnz",
    4: "bxc",
    5: "out",
    6: "bdv",
    7: "cdv",
  };
}

function getComboOperand(operand, registers) {
  if (operand < 4) {
    return operand;
  } else if (operand === 4) {
    return registers.a;
  } else if (operand === 5) {
    return registers.b;
  } else if (operand === 6) {
    return registers.c;
  } else {
    throw new Error("Unknown operand");
  }
}

function getInput(file) {
  const numbers = file.match(/\d+/g).map(Number);
  const registers = {
    a: numbers[0],
    b: numbers[1],
    c: numbers[2],
  };
  const program = numbers.slice(3);
  return { registers, program };
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const file = readFile(DAY, filename);
  const { registers, program } = getInput(file);
  let a = 0;
  for (let i = program.length - 1; i >= 0; i--) {
    a = a * 8;
    const expectedOutput = program.slice(i).join(",");
    let output = runProgram({ ...registers, a }, program);
    while (output.join(",") !== expectedOutput) {
      a++;
      output = runProgram({ ...registers, a }, program);
    }
  }

  return a;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  runTestCases();
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, "4,6,3,5,6,3,5,2,1,0");
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, "2,3,4,7,5,7,3,0,7");
  const input3Part2Result = await solvePartTwo("input3.txt");
  assert.strictEqual(input3Part2Result, 117440);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 190384609508367);
}

function runTestCases() {
  const testCases = [
    {
      registers: { a: 10, b: 0, c: 0 },
      program: [5, 0, 5, 1, 5, 4],
      expectedOutput: [0, 1, 2],
    },
    {
      registers: { a: 2024, b: 0, c: 0 },
      program: [0, 1, 5, 4, 3, 0],
      expectedOutput: [4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0],
      expectedRegisters: { a: 0 },
    },
    {
      registers: { a: 0, b: 0, c: 9 },
      program: [2, 6],
      expectedRegisters: { b: 1 },
    },
    {
      registers: { a: 0, b: 29, c: 0 },
      program: [1, 7],
      expectedRegisters: { b: 26 },
    },
    {
      registers: { a: 0, b: 2024, c: 43690 },
      program: [4, 0],
      expectedRegisters: { b: 44354 },
    },
  ];
  for (let testCase of testCases) {
    const output = runProgram(testCase.registers, testCase.program);
    if (testCase.expectedOutput) {
      assert.deepStrictEqual(output, testCase.expectedOutput);
    }
    if (testCase.expectedRegisters) {
      for (const key of Object.keys(testCase.expectedRegisters)) {
        assert.strictEqual(
          testCase.registers[key],
          testCase.expectedRegisters[key]
        );
      }
    }
  }
}
