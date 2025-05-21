import { readFile } from "@shared/fileReader";
import assert from "assert";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const input = readFile(filename);
  const blocks = getBlockRepresentation(input);
  const compactedBlocks = compactBlocks(blocks);
  const checksum = getChecksum(compactedBlocks);
  return checksum;
}

function getBlockRepresentation(input: string) {
  let blockRepresentation: string[] = [];
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    const character = i % 2 === 0 ? String(id++) : ".";
    const newArray = Array(parseInt(input[i])).fill(character);
    blockRepresentation = blockRepresentation.concat(newArray);
  }
  return blockRepresentation;
}

function compactBlocks(blocks: string[]) {
  let compactedBlocks = [...blocks];
  let currentEndBlockIndex = blocks.length - 1;
  for (let i = 0; i < compactedBlocks.length; i++) {
    if (compactedBlocks[i] === ".") {
      while (compactedBlocks[currentEndBlockIndex] === ".") {
        currentEndBlockIndex--;
      }
      if (currentEndBlockIndex <= i) {
        break;
      }
      compactedBlocks[i] = compactedBlocks[currentEndBlockIndex];
      compactedBlocks[currentEndBlockIndex] = ".";
      currentEndBlockIndex--;
    }
  }
  return compactedBlocks;
}

function getChecksum(block: string[]) {
  let sum = 0;
  for (let i = 0; i < block.length; i++) {
    if (block[i] !== ".") {
      sum += Number(block[i]) * i;
    }
  }
  return sum;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const input = readFile(filename);
  const blocks = getBlockRepresentation(input);
  const compactedBlocks = compactBlocksByWholeFiles(blocks);
  const checksum = getChecksum(compactedBlocks);
  return checksum;
}

function compactBlocksByWholeFiles(blocks: string[]) {
  let compactedBlocks = [...blocks];
  for (let i = compactedBlocks.length - 1; i > 0; i--) {
    if (compactedBlocks[i] === ".") {
      continue;
    }
    let j = i;
    let fileBlocks = [compactedBlocks[j]];
    while (j > 0 && compactedBlocks[j - 1] === fileBlocks[0]) {
      fileBlocks.push(compactedBlocks[j]);
      j--;
    }
    let startIndex = -1;
    const dots = ".".repeat(fileBlocks.length);
    for (let k = 0; k < compactedBlocks.length; k++) {
      if (
        compactedBlocks[k] === "." &&
        compactedBlocks.slice(k, k + fileBlocks.length).join("") === dots
      ) {
        startIndex = k;
        break;
      }
    }
    if (startIndex > 0 && startIndex < j) {
      const dotBlocks = Array(fileBlocks.length).fill(".");
      compactedBlocks.splice(j, fileBlocks.length, ...dotBlocks);
      compactedBlocks.splice(startIndex, fileBlocks.length, ...fileBlocks);
    }
    i = j;
  }
  return compactedBlocks;
}

export async function main() {
  console.log(`Hello from day9!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 1928);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 6288599492129);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 2858);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 6321896265143);
}
