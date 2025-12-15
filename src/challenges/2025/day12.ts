import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  // key: present Id, value: total area needed
  const presents: Map<number, number> = new Map();
  let currentPresent = -1;

  for await (const line of rl) {
    if (line.trim() === "") {
      continue;
    } else if (line.match(/^(\d+):$/)) {
      currentPresent = Number(line.match(/^(\d+):$/)![1]);
      presents.set(currentPresent, 0);
    } else if (line.match(/^\d+x\d+:/)) {
      const [dimensionsPart, rest] = line.split(":");
      const [width, length] = dimensionsPart.split("x").map(Number);
      const presentsQuantity = rest.trim().split(" ").map(Number);
      let totalAreaNeeded = 0;
      for (let i = 0; i < presentsQuantity.length; i++) {
        const quantity = presentsQuantity[i];
        totalAreaNeeded += quantity * presents.get(i)!;
      }
      if (totalAreaNeeded <= width * length) {
        score++;
      }
    } else {
      const currentArea = presents.get(currentPresent) || 0;
      const newArea = (line.trim().match(/#/g) || []).length;
      presents.set(currentPresent, currentArea + newArea);
    }
  }
  return score;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
  }
  return score;
}

export async function main() {
  console.log(`Hello from day12!`);
  // const input1Part1Result = await solvePartOne("input1.txt");
  // assert.strictEqual(input1Part1Result, 2);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 499);
  //const input1Part2Result = await solvePartTwo("input1.txt");
  //assert.strictEqual(input1Part2Result, 0);
  //const input2Part2Result = await solvePartTwo("input2.txt");
  //assert.strictEqual(input2Part2Result, 0);
}
