#!/usr/bin/env node
import { readFile } from "../shared/fileReader.mjs";
import assert from "assert";

const DAY = 11;
const stoneCountCache = {};
const stoneBlinkCache = {};

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const file = readFile(DAY, filename);
  let stones = file.split(" ").map(Number);

  return stones.map(stone => getStoneCount(stone, 25)).reduce((acc, val) => acc + val, 0);
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

    const file = readFile(DAY, filename);
    let stones = file.split(" ").map(Number);
    return stones.map(stone => getStoneCount(stone, 75)).reduce((acc, val) => acc + val, 0);
}

function blinkStone(stone){
    if(stoneBlinkCache[stone]){
        return stoneBlinkCache[stone];
    }
    let result = [];
    if(stone === 0) {
        result = [1];
    } else if (stone.toString().length % 2 === 0) {
        const digits = stone.toString();
        const firstHalf = digits.slice(0, digits.length / 2);
        const secondHalf = digits.slice(digits.length / 2);
        result = [Number(firstHalf), Number(secondHalf)];
    } else {
        result = [stone * 2024];
    }
    stoneBlinkCache[stone] = result;
    return result;
}

function getStoneCount(stone, blinks){
    const stoneBlinkedResult = blinkStone(stone);
    if(blinks=== 1){
        return stoneBlinkedResult.length;
    }
    const dictKey = `${stone}-${blinks}`;
    if(stoneCountCache[dictKey]){
        return stoneCountCache[dictKey];
    }
    const result = stoneBlinkedResult.map(stone => getStoneCount(stone, blinks - 1)).reduce((acc, val) => acc + val, 0);
    stoneCountCache[dictKey] = result;
    return result;
}

export async function main() {
  console.log(`Hello from day${DAY}!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 55312);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 189547,);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 65601038650482);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 224577979481346);
}
