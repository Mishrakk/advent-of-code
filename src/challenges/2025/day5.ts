import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  let areNumbers = false;
  const ranges: {min:number, max:number}[] = [];

  for await (const line of rl) {
    if (line.trim() === "") {
      areNumbers = true;
      continue;
    }
    if (areNumbers) {
      const number = Number(line.trim());
      for (const range of ranges) {
        if (number >= range.min && number <= range.max) {
          score++;
          break;
        }
      }
    } else {
      const [min, max] = line.split("-").map(Number);
      ranges.push({min, max});
    }

  }
  return score;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const ranges: {min:number, max:number}[] = [];
  let areNumbers = false;

  for await (const line of rl) {
    if (line.trim() === "") {
      areNumbers = true;
      continue;
    }
    if (areNumbers) {
      continue;
    } else {
      const [min, max] = line.split("-").map(Number);
      ranges.push({min, max});
    }

  }
  ranges.sort((a, b) => a.min - b.min);
  while (true) {
    let merged = false;
    for (let i = 0; i < ranges.length - 1; i++) {
      if (ranges[i].max >= ranges[i + 1].min - 1) {
        ranges[i].max = Math.max(ranges[i].max, ranges[i + 1].max);
        ranges.splice(i + 1, 1);
        merged = true;
      }
    }
    if (!merged) break;
  }
  for (let i = 0; i < ranges.length; i++) {
    score += ranges[i].max - ranges[i].min + 1;
  }

  return score;
}

export async function main() {
  console.log(`Hello from day5!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 3);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 701);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 14);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 352340558684863);
}
