import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

interface position3d {
  x: number;
  y: number;
  z: number;
}

async function solvePartOne(filename: string, numberOfConnections: number) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const junctionBoxes: {position: position3d, circuit: number}[] = [];

  let index = 0;
  for await (const line of rl) {
    const [x,y,z] = line.split(",").map(Number);
    junctionBoxes.push({position: {x, y, z}, circuit: index++} );
  }

  const distances: {p: number, q: number, dist: number}[] = [];
  for (let i = 0; i < junctionBoxes.length; i++) {
    for (let j = i + 1; j < junctionBoxes.length; j++) {
      const dist = getDistance(junctionBoxes[i].position, junctionBoxes[j].position);
      distances.push({p: i, q: j, dist});
    }
  }
  distances.sort((a, b) => a.dist - b.dist);


  for (let i = 0; i < numberOfConnections; i++) {
    const {p, q, dist} = distances[i];
    const boxP = junctionBoxes[p];
    const boxQ = junctionBoxes[q];
    junctionBoxes.filter(b => b.circuit === boxQ.circuit).forEach(b => b.circuit = boxP.circuit);
  }

  const nodesInCircuits: {[key: number]: number} = {};
  junctionBoxes.forEach(b => {
      nodesInCircuits[b.circuit] = (nodesInCircuits[b.circuit] || 0) + 1;
  });

  score = Object.values(nodesInCircuits)
    .sort((a, b) => b - a)
    .slice(0, 3).reduce((sum, val) => sum * val, 1);

  return score;
}

function getDistance(p: position3d, q: position3d): number {
  return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2) + Math.pow(p.z - q.z, 2));
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const junctionBoxes: {position: position3d, circuit: number}[] = [];

  let index = 0;
  for await (const line of rl) {
    const [x,y,z] = line.split(",").map(Number);
    junctionBoxes.push({position: {x, y, z}, circuit: index++} );
  }

  const distances: {p: number, q: number, dist: number}[] = [];
  for (let i = 0; i < junctionBoxes.length; i++) {
    for (let j = i + 1; j < junctionBoxes.length; j++) {
      const dist = getDistance(junctionBoxes[i].position, junctionBoxes[j].position);
      distances.push({p: i, q: j, dist});
    }
  }
  distances.sort((a, b) => a.dist - b.dist);

  let circuits = junctionBoxes.length;
  while(true) {
    const {p, q, dist} = distances.shift()!;
    const boxP = junctionBoxes[p];
    const boxQ = junctionBoxes[q];
    if (boxP.circuit !== boxQ.circuit) {
      junctionBoxes.filter(b => b.circuit === boxQ.circuit).forEach(b => b.circuit = boxP.circuit);
      circuits--;
      if (circuits === 1) {
        score = boxP.position.x * boxQ.position.x;
        break;
      }
    }
    
  }

  return score;
}

export async function main() {
  console.log(`Hello from day8!`);
  const input1Part1Result = await solvePartOne("input1.txt", 10);
  assert.strictEqual(input1Part1Result, 40);
  const input2Part1Result = await solvePartOne("input2.txt", 1000);
  assert.strictEqual(input2Part1Result, 102816);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 25272);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 100011612);
}
