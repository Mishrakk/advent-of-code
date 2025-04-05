import { readFile } from "../../shared/fileReader";
import assert from "assert";

interface Gate {
  input1: string;
  gate: string;
  input2: string;
  output: string;
}

function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const file = readFile(filename);

  const { inputs, gates } = parseInput(file);

  for (let i = 0; i < gates.length; i++) {
    const gate = gates[i];
    const input1 = inputs.get(gate.input1);
    const input2 = inputs.get(gate.input2);
    if (input1 === undefined || input2 === undefined) {
      continue;
    }
    const output = calculateOutput(input1, input2, gate.gate);
    inputs.set(gate.output, output);
    gates.splice(i, 1);
    i = -1;
  }

  const zKeys = Array.from(inputs.keys())
    .filter((key) => key.startsWith("z"))
    .sort()
    .reverse();
  let binaryString = "";
  for (const key of zKeys) {
    binaryString += inputs.get(key);
  }
  const decimalValue = parseInt(binaryString, 2);
  return decimalValue;
}

function parseInput(file: string) {
  const inputs = new Map();

  const inputMatches = file.matchAll(/(\w+): (\d)/g);
  for (const match of inputMatches) {
    inputs.set(match[1], parseInt(match[2], 10));
  }
  const gates = [];
  const gatesMatches = file.matchAll(/(\w+)\s(\w+)\s(\w+) -> (\w+)/g);
  for (const match of gatesMatches) {
    gates.push({
      input1: match[1],
      gate: match[2],
      input2: match[3],
      output: match[4],
    });
  }
  return { inputs, gates };
}

function calculateOutput(input1: number, input2: number, gate: string) {
  switch (gate) {
    case "AND":
      return input1 * input2;
    case "OR":
      return input1 === 1 || input2 === 1 ? 1 : 0;
    case "XOR":
      return input1 !== input2 ? 1 : 0;
  }
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const file = readFile(filename);

  const { inputs, gates } = parseInput(file);

  const wrongGates = [];
  for (const gate of gates) {
    if (!zOutputHasXorGate(gate)) {
      wrongGates.push(gate);
    }

    if (!xorGateHasXYInput(gate)) {
      wrongGates.push(gate);
    }

    if (!xorGateWithXYInputIsInputToXorGate(gate, gates)) {
      wrongGates.push(gate);
    }

    if (!andGateWithXYInputIsInputToOrGate(gate, gates)) {
      wrongGates.push(gate);
    }
  }

  const answer = wrongGates
    .map((gate) => gate.output)
    .sort()
    .join(",");
  return answer;
}

function zOutputHasXorGate(gate: Gate) {
  if (
    gate.output.startsWith("z") &&
    gate.output !== "z45" &&
    gate.gate !== "XOR"
  ) {
    return false;
  }
  return true;
}

function xorGateHasXYInput(gate: Gate) {
  if (
    gate.gate === "XOR" &&
    !gate.output.startsWith("z") &&
    !gate.input1.startsWith("x") &&
    !gate.input2.startsWith("x") &&
    !gate.input1.startsWith("y") &&
    !gate.input2.startsWith("y")
  ) {
    return false;
  }
  return true;
}

function xorGateWithXYInputIsInputToXorGate(gate: Gate, gates: Gate[]) {
  if (
    gate.gate === "XOR" &&
    (gate.input1.startsWith("x") ||
      gate.input2.startsWith("x") ||
      gate.input1.startsWith("y") ||
      gate.input2.startsWith("y")) &&
    !(gate.input1.endsWith("00") || gate.input2.endsWith("00"))
  ) {
    const gate2 = gates.find(
      (g) =>
        g.gate === "XOR" &&
        (g.input1 === gate.output || g.input2 === gate.output) &&
        !(g.input1.endsWith("00") || g.input2.endsWith("00"))
    );
    if (gate2 === undefined) {
      return false;
    }
  }
  return true;
}

function andGateWithXYInputIsInputToOrGate(gate: Gate, gates: Gate[]) {
  if (
    gate.gate === "AND" &&
    (gate.input1.startsWith("x") ||
      gate.input2.startsWith("x") ||
      gate.input1.startsWith("y") ||
      gate.input2.startsWith("y")) &&
    !(gate.input1.endsWith("00") || gate.input2.endsWith("00")) &&
    !gate.output.startsWith("z")
  ) {
    const gate2 = gates.find(
      (g) =>
        g.gate === "OR" &&
        (g.input1 === gate.output || g.input2 === gate.output) &&
        !(g.input1.endsWith("00") || g.input2.endsWith("00"))
    );
    if (gate2 === undefined) {
      return false;
    }
  }
  return true;
}

export async function main() {
  console.log(`Hello from day24!`);
  const input1Part1Result = solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 4);
  const input2Part1Result = solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 2024);
  const input3Part1Result = solvePartOne("input3.txt");
  assert.strictEqual(input3Part1Result, 63168299811048);
  const input1Part2Result = await solvePartTwo("input3.txt");
  assert.strictEqual(input1Part2Result, "dwp,ffj,gjh,jdr,kfm,z08,z22,z31");
}
