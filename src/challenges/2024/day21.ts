import { getRlInterface } from "@shared/fileReader";
import assert from "assert";

const cache = new Map();

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const numericPaths = getNumericPaths();
  const directionalPaths = getDirectionalPaths();

  for await (const line of rl) {
    let sequence = convertSequence(line, numericPaths);
    sequence = convertSequence(sequence, directionalPaths);
    sequence = convertSequence(sequence, directionalPaths);
    const number = parseInt(line.replace(/A/g, "").replace(/^0*/, ""), 10);
    score += number * sequence.length;
  }
  return score;
}

function convertSequence(sequence: string, paths: { [key: string]: string }) {
  let result = "";
  let previous = "A";
  for (let i = 0; i < sequence.length; i++) {
    const current = sequence[i];
    result += paths[`${previous},${current}`];
    previous = current;
  }
  return result;
}

function getNumericPaths() {
  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "", "0", "A"];
  return getPathsForKeys(keys);
}

function getDirectionalPaths() {
  const keys = ["", "^", "A", "<", "v", ">"];
  return getPathsForKeys(keys);
}

function getPathsForKeys(keys: string[]) {
  const paths: { [key: string]: string } = {};
  const keyInvalid = getCoordinates(keys.indexOf(""));

  for (let k1 = 0; k1 < keys.length; k1++) {
    const key1 = getCoordinates(k1);
    for (let k2 = 0; k2 < keys.length; k2++) {
      const key2 = getCoordinates(k2);
      // path priorities: left, down, up, right
      let path =
        "<".repeat(Math.max(key1.j - key2.j, 0)) +
        "v".repeat(Math.max(key2.i - key1.i, 0)) +
        "^".repeat(Math.max(key1.i - key2.i, 0)) +
        ">".repeat(Math.max(key2.j - key1.j, 0));
      if (
        // (key1.i, key2.j) is a corner, we need to check if it is the invalid key
        `${key1.i},${key2.j}` === `${keyInvalid.i},${keyInvalid.j}` ||
        `${key2.i},${key1.j}` === `${keyInvalid.i},${keyInvalid.j}`
      ) {
        path = path.split("").reverse().join("");
      }

      paths[`${keys[k1]},${keys[k2]}`] = path + "A";
    }
  }
  return paths;
}

function getCoordinates(index: number) {
  return {
    i: Math.floor(index / 3),
    j: index % 3,
  };
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const numericPaths = getNumericPaths();
  const directionalPaths = getDirectionalPaths();

  for await (const line of rl) {
    let sequence = convertSequence(line, numericPaths);
    const totalLength = getSequenceLength(sequence, directionalPaths, 25);
    const number = parseInt(line.replace(/A/g, "").replace(/^0*/, ""), 10);
    score += number * totalLength;
  }
  return score;
}

function getSequenceLength(
  sequence: string,
  paths: { [key: string]: string },
  iterations: number
) {
  if (iterations === 0) {
    return sequence.length;
  }

  const cacheKey = `${sequence},${iterations}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  let previous = "A";
  let totalLength = 0;
  for (let i = 0; i < sequence.length; i++) {
    const current = sequence[i];
    totalLength += getSequenceLength(
      paths[`${previous},${current}`],
      paths,
      iterations - 1
    );

    previous = current;
  }
  cache.set(cacheKey, totalLength);
  return totalLength;
}

export async function main() {
  console.log(`Hello from day21!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 126384);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 202274);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 154115708116294);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 245881705840972);
}
