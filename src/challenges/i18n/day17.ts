import assert from "assert";
import { getRlInterface } from "@shared/fileReader";
import { Block } from "./day17/Block";
import { PuzzleGrid } from "./day17/PuzzleGrid";
import { getPosition } from "@shared/grid";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  const blocks: Block[] = [];
  let currentBlockLines: string[] = [];

  for await (const line of rl) {
    if (line.trim() === "") {
      blocks.push(new Block(currentBlockLines));
      currentBlockLines = [];
      continue;
    }
    currentBlockLines.push(line);
  }
  blocks.push(new Block(currentBlockLines));

  const grid = new PuzzleGrid(blocks);
  grid.placeCornerBlocks();
  grid.solve();
  const { i, j } = grid.getSolutionCoordinates()!;
  return i * j;
}

export async function main() {
  console.log(`Hello from day17!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 132);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 4375);
}
