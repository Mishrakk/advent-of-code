import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  let position = 50;
  const modulo = 100;

  for await (const line of rl) {
    const direction = line[0];
    const distance = parseInt(line.slice(1), 10);
    const change = direction == 'L' ? -distance : distance;
    position = (position + change + modulo) % modulo;
    score += position === 0 ? 1 : 0;
  }
  return score;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  let position = 50;
  const modulo = 100;

  for await (const line of rl) {
    const direction = line[0];
    let distance = parseInt(line.slice(1), 10);
    if (distance >= modulo) {
      const cycles = Math.floor(distance/modulo);
      score += cycles;
      distance -= cycles * modulo;
    }
    const change = direction == 'L' ? -distance : distance;
    if ((position !== 0) && (position + change < 0 || position + change > modulo)) {
      score ++;
    }

    position = (position + change + modulo) % modulo;
    score += position === 0 ? 1 : 0;
  }
  return score;
}

export async function main() {
  console.log(`Hello from day1!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 3);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 1152);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 6);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 6671);
}
