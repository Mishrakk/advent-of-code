#!/usr/bin/env node
import { getRlInterface } from "../../shared/fileReader.mjs";
import assert from "assert";

async function solvePartOne(filename) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);

  const { tNodes, connections } = await getTNodesAndConnections(rl);

  const tNodesGroups = new Set();

  for (const [node, neighbors] of Object.entries(tNodes)) {
    const neighborsArray = Array.from(neighbors);
    for (let i = 0; i < neighborsArray.length; i++) {
      for (let j = i + 1; j < neighborsArray.length; j++) {
        if (connections.has(`${neighborsArray[i]}-${neighborsArray[j]}`)) {
          const group = [node, neighborsArray[i], neighborsArray[j]]
            .sort()
            .join("-");
          tNodesGroups.add(group);
        }
      }
    }
  }
  return tNodesGroups.size;
}

async function getTNodesAndConnections(rl) {
  const connections = new Map();
  const tNodes = {};

  for await (const line of rl) {
    const [node1, node2] = line.split("-");
    if (!connections.has(`${node1}-${node2}`)) {
      connections.set(`${node1}-${node2}`, true);
    }
    if (!connections.has(`${node2}-${node1}`)) {
      connections.set(`${node2}-${node1}`, true);
    }
    if (node1.startsWith("t")) {
      if (!tNodes[node1]) {
        tNodes[node1] = new Set();
      }
      tNodes[node1].add(node2);
    }
    if (node2.startsWith("t")) {
      if (!tNodes[node2]) {
        tNodes[node2] = new Set();
      }
      tNodes[node2].add(node1);
    }
  }
  return { tNodes, connections };
}

async function getNodes(rl) {
  const nodes = new Map();

  for await (const line of rl) {
    const [node1, node2] = line.split("-");
    if (!nodes.has(node1)) {
      nodes.set(node1, new Set());
    }
    if (!nodes.has(node2)) {
      nodes.set(node2, new Set());
    }
    nodes.get(node1).add(node2);
    nodes.get(node2).add(node1);
  }
  return nodes;
}

async function solvePartTwo(filename) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  const allNodes = await getNodes(rl);
  const nodesToProcess = new Set(allNodes.keys());
  const cliques = [];
  while (nodesToProcess.size > 0) {
    const clique = new Set();
    const node = nodesToProcess.values().next().value;
    clique.add(node);
    nodesToProcess.delete(node);
    const neighbors = allNodes.get(node);
    for (const neighbor of neighbors) {
      let isEveryoneConnected = true;
      for (const cliqueNode of clique) {
        if (!allNodes.get(cliqueNode).has(neighbor)) {
          isEveryoneConnected = false;
          break;
        }
      }
      if (!isEveryoneConnected) {
        continue;
      }
      clique.add(neighbor);
      if (nodesToProcess.has(neighbor)) {
        nodesToProcess.delete(neighbor);
      }
    }
    cliques.push(clique);
  }
  let largestClique = cliques[0];

  for (const clique of cliques) {
    if (clique.size > largestClique.size) {
      largestClique = clique;
    }
  }

  return Array.from(largestClique).sort().join(",");
}

export async function main() {
  console.log(`Hello from day23!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 7);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 1154);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, "co,de,ka,ta");
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(
    input2Part2Result,
    "aj,ds,gg,id,im,jx,kq,nj,ql,qr,ua,yh,zn"
  );
}
