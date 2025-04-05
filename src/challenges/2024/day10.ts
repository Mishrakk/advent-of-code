import { readFileTo2DArray } from "../../shared/fileReader";
import assert from "assert";

interface Position {
  i: number;
  j: number;
  height: number;
}

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const map = readFileTo2DArray(filename);
  let score = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "0") {
        const fullTrails = findFullTrails(map, { i, j, height: 0 });
        score += fullTrails.size;
      }
    }
  }
  return score;
}

function countFullTrails(map: string[][], startingPosition: Position) {
  let fullTrails = 0;
  const queue = [startingPosition];
  while (queue.length > 0) {
    const position = queue.shift()!;
    if (position.height === 9) {
      fullTrails++;
      continue;
    }
    const trailsUp = findTrailsUp(map, position);
    for (const trail of trailsUp) {
      queue.push(trail);
    }
  }
  return fullTrails;
}

function findFullTrails(map: string[][], startingPosition: Position) {
  const fullTrails = new Set();
  const queue = [startingPosition];
  while (queue.length > 0) {
    const position = queue.shift()!;
    if (position.height === 9) {
      fullTrails.add(JSON.stringify(position));
      continue;
    }
    const trailsUp = findTrailsUp(map, position);
    for (const trail of trailsUp) {
      queue.push(trail);
    }
  }
  return fullTrails;
}

function findTrailsUp(map: string[][], position: Position) {
  const trails = [];
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  for (const direction of directions) {
    let { i, j, height } = position;
    i += direction[0];
    j += direction[1];
    if (i < 0 || i >= map.length || j < 0 || j >= map.length) {
      continue;
    }
    if (Number(map[i][j]) === height + 1) {
      trails.push({ i, j, height: Number(map[i][j]) });
    }
  }
  return trails;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const map = readFileTo2DArray(filename);
  let score = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "0") {
        score += countFullTrails(map, { i, j, height: 0 });
      }
    }
  }
  return score;
}

export async function main() {
  console.log(`Hello from day10!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 36);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 566);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 81);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 1324);
}
