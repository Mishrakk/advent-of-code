import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

const CACHE = new Map<string, number>();

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const nodes: Map<string, string[]> = new Map();

  for await (const line of rl) {
    const [node, rest] = line.split(":");
    const edges = rest.trim().split(" ");
    nodes.set(node, edges);
  }

  const queue: string[] = ["you"];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === "out") {
      score++;
    } else {
      for (const edge of nodes.get(current)!) {
        queue.push(edge);
      }
    }
  }
  return score;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const nodes: Map<string, string[]> = new Map();
  CACHE.clear();

  for await (const line of rl) {
    const [node, rest] = line.split(":");
    const edges = rest.trim().split(" ");
    nodes.set(node, edges);
  }

  const svrToFft = findPaths("svr", "fft", nodes);
  const fftToDac = findPaths("fft", "dac", nodes);
  const dacToOut = findPaths("dac", "out", nodes);
  const svrToDac = findPaths("svr", "dac", nodes);
  const dacToFft = findPaths("dac", "fft", nodes);
  const fftToOut = findPaths("fft", "out", nodes);

  score = svrToFft * fftToDac * dacToOut + svrToDac * dacToFft * fftToOut;

  return score;
}

function findPaths(start: string, end: string, nodes: Map<string, string[]>) {
  if (CACHE.has(`${start}-${end}`)) {
    return CACHE.get(`${start}-${end}`)!;
  }
  let paths = 0;
  for (const edge of nodes.get(start)!) {
    if (edge === end) {
      paths++;
    } else if (!nodes.has(edge)) {
      continue;
    } else {
      paths += findPaths(edge, end, nodes);
    }
  }
  CACHE.set(`${start}-${end}`, paths);
  return paths;
}

export async function main() {
  console.log(`Hello from day11!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 5);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 643);
  const input1Part2Result = await solvePartTwo("input3.txt");
  assert.strictEqual(input1Part2Result, 2);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 417190406827152);
}
