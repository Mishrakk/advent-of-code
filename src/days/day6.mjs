#!/usr/bin/env node
import { readFileTo2DArray } from "../shared/fileReader.mjs";
import assert from "assert";

const DAY = 6;
const DIRECTIONS = ["^", ">", "v", "<"];

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const map = readFileTo2DArray(DAY, filename);
  let guardPosition = findGuardPosition(map);

  while (isPositionInbounds(map, guardPosition)) {
    map[guardPosition.y][guardPosition.x] = "X";
    guardPosition = getNextPosition(map, guardPosition);
    if (isPositionInbounds(map, guardPosition)) {
      map[guardPosition.y][guardPosition.x] = guardPosition.direction;
    }
  }
  return calculateScore(map);
}

function findGuardPosition(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "^") {
        return {
          x: j,
          y: i,
          direction: "^",
        };
      }
    }
  }
}

function calculateScore(map) {
  let score = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "X") {
        score++;
      }
    }
  }
  return score;
}

function getForwardPosition(position) {
  const newPosition = { ...position };
  switch (newPosition.direction) {
    case "^":
      newPosition.y -= 1;
      break;
    case "v":
      newPosition.y += 1;
      break;
    case "<":
      newPosition.x -= 1;
      break;
    case ">":
      newPosition.x += 1;
      break;
  }
  return newPosition;
}

function getNextPosition(map, position) {
  const positionCopy = { ...position };
  let newPosition = getForwardPosition(positionCopy);
  while (
    isPositionInbounds(map, newPosition) &&
    map[newPosition.y][newPosition.x] === "#"
  ) {
    positionCopy.direction = getNextDirection(positionCopy.direction);
    newPosition = getForwardPosition(positionCopy);
  }
  return newPosition;
}

function getNextDirection(guardDirection) {
  return DIRECTIONS[
    (DIRECTIONS.indexOf(guardDirection) + 1) % DIRECTIONS.length
  ];
}

function isPositionInbounds(map, position) {
  return (
    position.x >= 0 &&
    position.x < map.length &&
    position.y >= 0 &&
    position.y < map.length
  );
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const map = readFileTo2DArray(DAY, filename);
  const startingGuardPosition = findGuardPosition(map);
  let guardPosition = startingGuardPosition;
  let obstaclePositions = new Set();

  while (isPositionInbounds(map, guardPosition)) {
    const nextPosition = getNextPosition(map, guardPosition);
    if (
      isPositionInbounds(map, nextPosition) &&
      map[nextPosition.y][nextPosition.x] === "."
    ) {
      const newMap = map.map((row) => [...row]);
      newMap[nextPosition.y][nextPosition.x] = "#";
      if (hasLoop(newMap, startingGuardPosition)) {
        obstaclePositions.add(`${nextPosition.x},${nextPosition.y}`);
      }
    }

    guardPosition = nextPosition;
  }

  return obstaclePositions.size;
}

function hasLoop(map, startingPosition) {
  const visited = new Set();
  let position = { ...startingPosition };
  const mapCopy = map.map((row) => [...row]);
  while (isPositionInbounds(map, position)) {
    const positionString = positionToString(position);
    mapCopy[position.y][position.x] = position.direction;
    if (visited.has(positionString)) {
      return true;
    }
    visited.add(positionString);
    position = getNextPosition(map, position);
  }
  return false;
}

function positionToString(position) {
  return `${position.x},${position.y},${position.direction}`;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 41);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 4433);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 6);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 1516);
}
