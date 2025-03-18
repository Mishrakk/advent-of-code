#!/usr/bin/env node
import { readFileTo2DArray } from "../../shared/fileReader.mjs";
import assert from "assert";

const DAY = 10;

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const map = readFileTo2DArray(DAY, filename);
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

function countFullTrails(map, startingPosition) {
  let fullTrails = 0;
  const queue = [startingPosition];
  while (queue.length > 0) {
    const position = queue.shift();
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

function findFullTrails(map, startingPosition) {
  const fullTrails = new Set();
  const queue = [startingPosition];
  while (queue.length > 0) {
    const position = queue.shift();
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

function findTrailsUp(map, position) {
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

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const map = readFileTo2DArray(DAY, filename);
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
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 36);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 566);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 81);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 1324);
}
