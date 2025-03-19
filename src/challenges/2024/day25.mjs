#!/usr/bin/env node
import { getRlInterface } from "../../shared/fileReader.mjs";
import assert from "assert";

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const lines = [];
  const rl = getRlInterface(filename);

  for await (const line of rl) {
    lines.push(line);
  }

  const keys = [];
  const locks = [];

  for (let i = 0; i < lines.length; i += 8) {
    const newObject = [0, 0, 0, 0, 0];
    for (let j = 1; j < 6; j++) {
      for (let k = 0; k < 5; k++) {
        if (lines[i + j][k] === "#") {
          newObject[k]++;
        }
      }
    }
    if (lines[i] === "#####") {
      keys.push(newObject);
    } else {
      locks.push(newObject);
    }
  }

  let score = 0;
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < locks.length; j++) {
      let match = true;
      for (let k = 0; k < 5; k++) {
        if (keys[i][k] + locks[j][k] > 5) {
          match = false;
          break;
        }
      }
      if (match) {
        score++;
      }
    }
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
  console.log(`Hello from day25!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 3);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 3223);
  //const input1Part2Result = await solvePartTwo("input1.txt");
  //assert.strictEqual(input1Part2Result, 0);
  //const input2Part2Result = await solvePartTwo("input2.txt");
  //assert.strictEqual(input2Part2Result, 0);
}
