import assert from "assert";
import { getRlInterface, readFile } from "@shared/fileReader";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const file = readFile(filename);
  const ranges = file.split(",");
  let score = 0;

  for await (const range of ranges) {
    const [min, max] = range.split("-").map(Number);
    for (let i = min; i <= max; i++) {
      score += checkIfRepeatedTwice(i) ? i : 0;
    }
  }
  return score;
}

function checkIfRepeatedTwice(id: number) {
  const idStr = id.toString();
  return checkIfPatternRepeats(id, idStr.length / 2);
}

function checkIfPatternRepeats(id: number, patternLength: number) {
  const idStr = id.toString();
  const parts = idStr.match(new RegExp(`.{0,${patternLength}}`, "g")) || [];
  parts.pop();
  if (parts.length < 2) return false;
  return parts.every((p) => p === parts[0]);
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const file = readFile(filename);
  const ranges = file.split(",");
  let score = 0;

  for await (const range of ranges) {
    const [min, max] = range.split("-").map(Number);
    for (let i = min; i <= max; i++) {
      const length = i.toString().length;
      for (
        let patternLength = 1;
        patternLength <= Math.floor(length / 2);
        patternLength++
      ) {
        if (checkIfPatternRepeats(i, patternLength)) {
          score += i;
          break;
        }
      }
    }
  }
  return score;
}

export async function main() {
  console.log(`Hello from day2!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 1227775554);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 24043483400);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 4174379265);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 38262920235);
}
