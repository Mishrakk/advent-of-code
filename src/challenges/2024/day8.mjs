#!/usr/bin/env node
import { getRlInterface } from "../../shared/fileReader.mjs";
import assert from "assert";

const DAY = 8;

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(DAY, filename);

  const { antennas, lineIndex } = await getAntennas(rl);

  let antinodes = new Set();

  for (const antenna in antennas) {
    const positions = antennas[antenna];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const x1 = positions[i];
        const x2 = positions[j];
        const deltaX = x2.x - x1.x;
        const deltaY = x2.y - x1.y;
        const antinode1 = { x: x2.x + deltaX, y: x2.y + deltaY };
        const antinode2 = { x: x1.x - deltaX, y: x1.y - deltaY };
        if (isInbounds(antinode1, lineIndex)) {
          antinodes.add(`${antinode1.x},${antinode1.y}`);
        }
        if (isInbounds(antinode2, lineIndex)) {
          antinodes.add(`${antinode2.x},${antinode2.y}`);
        }
      }
    }
  }
  return antinodes.size;
}

async function getAntennas(rl) {
  let antennas = {};
  let lineIndex = 0;
  for await (const line of rl) {
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== ".") {
        if (!antennas[line[i]]) {
          antennas[line[i]] = [];
        }
        antennas[line[i]].push({ x: i, y: lineIndex });
      }
    }
    lineIndex++;
  }
  return { antennas, lineIndex };
}

function isInbounds(position, limit) {
  return (
    position.x >= 0 &&
    position.x < limit &&
    position.y >= 0 &&
    position.y < limit
  );
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(DAY, filename);
  const { antennas, lineIndex } = await getAntennas(rl);

  let antinodes = new Set();

  for (const antenna in antennas) {
    const positions = antennas[antenna];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const x1 = positions[i];
        const x2 = positions[j];
        const deltaX = x2.x - x1.x;
        const deltaY = x2.y - x1.y;
        for (let k = 0; ; k++) {
          const antinode1 = { x: x2.x + deltaX * k, y: x2.y + deltaY * k };
          const antinode2 = { x: x1.x - deltaX * k, y: x1.y - deltaY * k };
          let noVotes = 0;
          if (isInbounds(antinode1, lineIndex)) {
            antinodes.add(`${antinode1.x},${antinode1.y}`);
          } else {
            noVotes++;
          }
          if (isInbounds(antinode2, lineIndex)) {
            antinodes.add(`${antinode2.x},${antinode2.y}`);
          } else {
            noVotes++;
          }
          if (noVotes === 2) {
            break;
          }
        }
      }
    }
  }
  return antinodes.size;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 14);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 247);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 34);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 861);
}
