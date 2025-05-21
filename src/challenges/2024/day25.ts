import { getRlInterface } from "@shared/fileReader";
import assert from "assert";

async function solvePartOne(filename: string) {
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

export async function main() {
  console.log(`Hello from day25!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 3);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 3223);
}
