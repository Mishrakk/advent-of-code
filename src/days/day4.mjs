#!/usr/bin/env node
import { getRlInterface, readFileTo2DArray } from "../shared/fileReader.mjs";
import assert from "assert";

const DAY = 4;

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(DAY, filename);

  let xmasCount = 0;
  let verticals = [];
  let diagonals = [];
  let reverseDiagonals = [];

  for await (const line of rl) {
    if (diagonals.length === 0) {
      diagonals = initializeDiagonals(line);
      reverseDiagonals = initializeDiagonals(line);
    }
    xmasCount += getXmasCountInLine(line);
    for (let i = 0; i < line.length; i++) {
      if (!verticals[i]) {
        verticals[i] = "";
      }
      verticals[i] += line[i];
    }
    for (const i in diagonals) {
      if (diagonals[i] && diagonals[i].length < line.length) {
        diagonals[i] += line[diagonals[i].length];
      }
    }
    const lastCharIndex = line.length - 1;
    for (const i in reverseDiagonals) {
      if (reverseDiagonals[i] && reverseDiagonals[i].length < line.length) {
        const index = lastCharIndex - reverseDiagonals[i].length;
        reverseDiagonals[i] += line[index];
      }
    }
    diagonals.push(line[0]);
    reverseDiagonals.push(line[lastCharIndex]);
  }
  for (const vertical of verticals) {
    xmasCount += getXmasCountInLine(vertical);
  }
  for (const diagonal of diagonals) {
    xmasCount += getXmasCountInLine(diagonal);
  }
  for (const reverseDiagonal of reverseDiagonals) {
    xmasCount += getXmasCountInLine(reverseDiagonal);
  }
  console.log("XMAS count:", xmasCount);
  return xmasCount;
}

function initializeDiagonals(line) {
  let diagonals = [];
  for (let i = 1; i < line.length; i++) {
    diagonals.push(".".repeat(i));
  }
  return diagonals;
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const array2D = readFileTo2DArray(DAY, filename);
  // first index is row number
  let matches = 0;
  for (let i = 1; i < array2D.length - 1; i++) {
    for (let j = 1; j < array2D[i].length - 1; j++) {
      if (array2D[i][j] === "A") {
        const diagonal1 = `${array2D[i - 1][j - 1]}A${array2D[i + 1][j + 1]}`;
        const diagonal2 = `${array2D[i - 1][j + 1]}A${array2D[i + 1][j - 1]}`;
        if (
          (diagonal1 === "SAM" || diagonal1 === "MAS") &&
          (diagonal2 === "SAM" || diagonal2 === "MAS")
        ) {
          matches++;
        }
      }
    }
  }
  console.log("Matches:", matches);
  return matches;
}

function getXmasCountInLine(line) {
  const xmasPattern = /XMAS/g;
  const xmasMatches = line.match(xmasPattern)?.length ?? 0;
  const samxPattern = /SAMX/g;
  const samxMatches = line.match(samxPattern)?.length ?? 0;
  return xmasMatches + samxMatches;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 18);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 2447);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 9);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 1868);
}
