#!/usr/bin/env node
import { getRlInterface } from "../../shared/fileReader.mjs";
import { printGrid } from "../../shared/grid.mjs";
import assert from "assert";

async function solvePartOne(filename, limits) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  const quadrants = [0, 0, 0, 0];

  for await (const line of rl) {
    const numbers = line.match(/-?\d+/g).map(Number);
    const robot = {
      x: numbers[0],
      y: numbers[1],
      vx: numbers[2],
      vy: numbers[3],
    };
    moveNTimes(robot, limits, 100);
    const quadrant = getQuadrant(robot, limits);
    if (quadrant !== null) {
      quadrants[quadrant]++;
    }
  }
  return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
}

function getQuadrant(robot, limits) {
  const halfX = Math.floor(limits.x / 2);
  const halfY = Math.floor(limits.y / 2);
  if (robot.x == halfX || robot.y === halfY) {
    return null;
  } else if (robot.x < halfX && robot.y < halfY) {
    return 0;
  } else if (robot.x > halfX && robot.y < halfY) {
    return 1;
  } else if (robot.x < halfX && robot.y > halfY) {
    return 2;
  } else {
    return 3;
  }
}

function moveNTimes(robot, limits, times) {
  robot.x = (robot.x + times * (robot.vx + limits.x)) % limits.x;
  robot.y = (robot.y + times * (robot.vy + limits.y)) % limits.y;
  return robot;
}

async function solvePartTwo(filename, limits) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  const robots = [];

  for await (const line of rl) {
    const numbers = line.match(/-?\d+/g).map(Number);
    const robot = {
      x: numbers[0],
      y: numbers[1],
      vx: numbers[2],
      vy: numbers[3],
    };
    robots.push(robot);
  }
  let i = 1;
  while (true) {
    robots.forEach((robot) => moveNTimes(robot, limits, 1));
    if (isEasterEgg(robots, limits)) {
      return i;
    }
    i++;
  }
}

function getGrid(robots, limits) {
  const grid = Array.from({ length: limits.y }, () =>
    Array.from({ length: limits.x }, () => ".")
  );
  for (const robot of robots) {
    grid[robot.y][robot.x] = "#";
  }
  return grid;
}

function isEasterEgg(robots, limits) {
  const grid = getGrid(robots, limits);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "#") {
        let k = 1;
        while (i + k < limits.y && grid[i + k][j] === "#") {
          k++;
        }
        if (k >= 10) {
          printGrid(grid);
          return true;
        }
      }
    }
  }
  return false;
}

export async function main() {
  console.log(`Hello from day14!`);
  const input1Part1Result = await solvePartOne("input1.txt", { x: 11, y: 7 });
  assert.strictEqual(input1Part1Result, 12);
  const input2Part1Result = await solvePartOne("input2.txt", {
    x: 101,
    y: 103,
  });
  assert.strictEqual(input2Part1Result, 218433348);
  //const input1Part2Result = await solvePartTwo("input1.txt");
  //assert.strictEqual(input1Part2Result, 0);
  const input2Part2Result = await solvePartTwo("input2.txt", {
    x: 101,
    y: 103,
  });
  assert.strictEqual(input2Part2Result, 6512);
}
