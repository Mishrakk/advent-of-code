import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

interface Tile {
  i: number;
  j: number;
}

interface Edge {
  p1: Tile;
  p2: Tile;
}

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const tiles = [];

  for await (const line of rl) {
    const [i, j] = line.split(",").map(Number);
    tiles.push({ i, j });
  }
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const area = (Math.abs(tiles[i].i - tiles[j].i) + 1)  * (Math.abs(tiles[i].j - tiles[j].j) + 1);
      if (area > score) {
        score = area;
      }
    }
  }
  return score;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const tiles: Tile[] = [];
  const rectangles: {tileA: Tile, tileB: Tile, area: number}[] = [];

  for await (const line of rl) {
    const [j, i] = line.split(",").map(Number);
    tiles.push({ i, j });
  }

  for (let a = 0; a < tiles.length; a++) {
    for (let b = a + 1; b < tiles.length; b++) {
      rectangles.push({
        tileA: tiles[a], 
        tileB: tiles[b], 
        area: (Math.abs(tiles[a].i - tiles[b].i) + 1) * (Math.abs(tiles[a].j - tiles[b].j) + 1)
      });
    }
  }
  rectangles.sort((a, b) => b.area - a.area);

  const polygonEdges: Edge[] = tiles.map((tile, i) => ({ p1: tile, p2: tiles[(i + 1) % tiles.length] }));

  for (const rectangle of rectangles) {
    if(isRectangleContainedInPolygon(rectangle, polygonEdges)) {
      score = rectangle.area;
      break;
    }
  }
  score = rectangles.find(r => isRectangleContainedInPolygon(r, polygonEdges))!.area;
  return score;
}

function isRectangleContainedInPolygon(rectangle: {tileA: Tile, tileB: Tile, area: number}, polygonEdges: Edge[]): boolean {
  const minI = Math.min(rectangle.tileA.i, rectangle.tileB.i);
  const maxI = Math.max(rectangle.tileA.i, rectangle.tileB.i);
  const minJ = Math.min(rectangle.tileA.j, rectangle.tileB.j);
  const maxJ = Math.max(rectangle.tileA.j, rectangle.tileB.j);

  for (const edge of polygonEdges) {
    const edgeMinI = Math.min(edge.p1.i, edge.p2.i);
    const edgeMaxI = Math.max(edge.p1.i, edge.p2.i);
    const edgeMinJ = Math.min(edge.p1.j, edge.p2.j);
    const edgeMaxJ = Math.max(edge.p1.j, edge.p2.j);

    if (minI < edgeMaxI && maxI > edgeMinI && minJ < edgeMaxJ && maxJ > edgeMinJ) {
      // there is an intersection
      return false;
    }
  }

  return true;
}

export async function main() {
  console.log(`Hello from day9!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 50);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 4782151432);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 24);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 1450414119);
}
