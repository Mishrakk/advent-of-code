import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solve(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
  }
  return score;
}

export async function main() {
  console.log(`Hello from day${day}!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 0);
  //const input2Result = await solve("input2.txt");
  //assert.strictEqual(input2Result, 0);
}
