import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

const cache: Map<string, number> = new Map();

interface Vertex {
  lights: string;
  presses: number;
}

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    const parts = line.split(" ");
    const lightsDiagram = parts.shift()!.slice(1, -1);
    const joltage = parts.pop();
    const buttons = parts;

    const visited: Set<string> = new Set();
    const queue: Vertex[] = [
      { lights: ".".repeat(lightsDiagram.length), presses: 0 },
    ];
    while (queue.length > 0) {
      const { lights, presses } = queue.shift()!;
      if (lights === lightsDiagram) {
        score += presses;
        break;
      }
      buttons.forEach((btn) => {
        const newLights = applyButton(lights, btn);
        if (!visited.has(newLights)) {
          visited.add(newLights);
          queue.push({ lights: newLights, presses: presses + 1 });
        }
      });
    }
  }
  return score;
}

function applyButton(lights: string, button: string): string {
  const result = [...lights];
  button
    .slice(1, -1)
    .split(",")
    .map(Number)
    .forEach((w) => {
      result[w] = result[w] === "." ? "#" : ".";
    });
  return result.join("");
}

function getCombinations<T>(array: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > array.length) return [];

  const result: T[][] = [];
  for (let i = 0; i <= array.length - k; i++) {
    const head = array[i];
    const tailCombos = getCombinations(array.slice(i + 1), k - 1);
    for (const combo of tailCombos) {
      result.push([head, ...combo]);
    }
  }
  return result;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    cache.clear();
    const parts = line.split(" ");
    const lightsDiagram = parts.shift()!.slice(1, -1);
    const targetJoltage = parts.pop()!.slice(1, -1);
    const buttons = parts.map((b) => b.slice(1, -1));
    const allButtonsCombinations = getAllButtonsCombinations(
      buttons,
      targetJoltage.split(",").length
    );
    const presses = getPressesForJoltage(targetJoltage, allButtonsCombinations);
    if (presses === Infinity) {
      debugger;
    }
    score += presses;
  }
  return score;
}

function getPressesForJoltage(
  joltageString: string,
  allButtonsCombinations: Map<string, { presses: number; endJoltage: number[] }>
) {
  if (cache.has(joltageString)) {
    return cache.get(joltageString)!;
  }
  const joltage = joltageString.split(",").map(Number);
  if (joltage.every((j) => j === 0)) {
    // end of recursion
    return 0;
  }
  let minPresses = Infinity;
  for (const combo of allButtonsCombinations.values()) {
    const newJoltage = applyButtonCombination(joltage, combo.endJoltage);
    if (newJoltage.every((j) => j >= 0 && j % 2 === 0)) {
      const halfJoltage = newJoltage.map((j) => j / 2).join(",");
      const halfPresses = getPressesForJoltage(
        halfJoltage,
        allButtonsCombinations
      );
      const totalPresses = combo.presses + 2 * halfPresses;
      minPresses = Math.min(minPresses, totalPresses);
    }
  }
  cache.set(joltageString, minPresses);
  return minPresses;
}

function applyButtonCombination(joltage: number[], comboJoltage: number[]) {
  const result = joltage.map((j, i) => j - comboJoltage[i]);
  return result;
}

function getAllButtonsCombinations(buttons: string[], joltageLength: number) {
  const combinations: Map<string, { presses: number; endJoltage: number[] }> =
    new Map();
  for (let i = 1; i <= buttons.length; i++) {
    const combos = getCombinations(buttons, i);
    for (const combo of combos) {
      const endJoltage = Array(joltageLength).fill(0);
      combo.forEach((btn) => {
        btn
          .split(",")
          .map(Number)
          .forEach((w) => {
            endJoltage[w]++;
          });
      });
      const key = endJoltage.join(",");
      if (
        !combinations.has(key) ||
        combinations.get(key)!.presses > combo.length
      ) {
        combinations.set(key, { presses: combo.length, endJoltage });
      }
    }
  }
  combinations.set(Array(joltageLength).fill(0).join(","), {
    presses: 0,
    endJoltage: Array(joltageLength).fill(0),
  });
  return combinations;
}

export async function main() {
  console.log(`Hello from day10!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 7);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 514);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 33);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 21824);
}
