import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

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
    const lightsDiagram = parts.shift()!.slice(1,-1);
    const joltage = parts.pop();
    const buttons = parts;
    
    const visited: Set<string> = new Set();
    const queue: Vertex[] = [{ lights: ".".repeat(lightsDiagram.length), presses: 0 }];
    while (queue.length > 0) {
      const {lights, presses} = queue.shift()!;
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
  button.slice(1, -1).split(",").map(Number).forEach(w => {
          result[w] = result[w] === "." ? "#" : ".";
        });
  return result.join("");
}


async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
  }
  return score;
}

export async function main() {
  console.log(`Hello from day10!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 7);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 514);
  //const input1Part2Result = await solvePartTwo("input1.txt");
  //assert.strictEqual(input1Part2Result, 0);
  //const input2Part2Result = await solvePartTwo("input2.txt");
  //assert.strictEqual(input2Part2Result, 0);
}
