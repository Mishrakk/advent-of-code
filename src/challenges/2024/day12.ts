import { readFileTo2DArray } from "../../shared/fileReader";
import assert from "assert";

interface Position {
  i: number;
  j: number;
}

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);

  const grid = readFileTo2DArray(filename);
  const visited = new Set();
  let price = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const position = { i, j };
      if (visited.has(getPositionString(position))) {
        continue;
      }
      const fence = getFence(grid, position);
      fence.visited.forEach((p) => {
        visited.add(p);
      });
      price += fence.perimeter * fence.area;
    }
  }
  return price;
}

function getFence(grid: string[][], startingPosition: Position) {
  let perimeter = 0;
  const queue = [startingPosition];
  const visited = new Set();
  let corners = 0;
  while (queue.length > 0) {
    const position = queue.shift()!;
    if (visited.has(getPositionString(position))) {
      continue;
    }
    visited.add(getPositionString(position));
    const neighbors = getNeighbors(grid, position);
    queue.push(...neighbors);
    perimeter += 4 - neighbors.length;
    corners += getCorners(grid, position);
  }
  const area = visited.size;
  return { perimeter, area, visited, corners };
}

function getPositionString(position: Position) {
  return `${position.i},${position.j}`;
}

function getNeighbors(grid: string[][], position: Position) {
  const neighbors = [];
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  for (const direction of directions) {
    let { i, j } = position;
    i += direction[0];
    j += direction[1];
    if (i < 0 || i >= grid.length || j < 0 || j >= grid.length) {
      continue;
    }
    if (grid[i][j] === grid[position.i][position.j]) {
      neighbors.push({ i, j });
    }
  }
  return neighbors;
}

function getCorners(grid: string[][], position: Position) {
  const hasTopNeighbor = hasNeighbor("TOP", grid, position);
  const hasBottomNeighbor = hasNeighbor("BOTTOM", grid, position);
  const hasLeftNeighbor = hasNeighbor("LEFT", grid, position);
  const hasRightNeighbor = hasNeighbor("RIGHT", grid, position);
  const hasTopRightNeighbor = hasNeighbor("TOPRIGHT", grid, position);
  const hasTopLeftNeighbor = hasNeighbor("TOPLEFT", grid, position);
  const hasBottomRightNeighbor = hasNeighbor("BOTTOMRIGHT", grid, position);
  const hasBottomLeftNeighbor = hasNeighbor("BOTTOMLEFT", grid, position);
  let corners = 0;
  /* checking convex corners
   * ....
   * .AA.
   * .AA.
   * ....
   */
  if (!hasTopNeighbor && !hasRightNeighbor) {
    corners++;
  }
  if (!hasRightNeighbor && !hasBottomNeighbor) {
    corners++;
  }
  if (!hasBottomNeighbor && !hasLeftNeighbor) {
    corners++;
  }
  if (!hasLeftNeighbor && !hasTopNeighbor) {
    corners++;
  }

  /* checking concave corners
   * .....
   * ..A..
   * .AAA.
   * ..A..
   * .....
   */
  if (hasTopNeighbor && hasRightNeighbor && !hasTopRightNeighbor) {
    corners++;
  }
  if (hasRightNeighbor && hasBottomNeighbor && !hasBottomRightNeighbor) {
    corners++;
  }
  if (hasBottomNeighbor && hasLeftNeighbor && !hasBottomLeftNeighbor) {
    corners++;
  }
  if (hasLeftNeighbor && hasTopNeighbor && !hasTopLeftNeighbor) {
    corners++;
  }
  return corners;
}

function hasNeighbor(direction: string, grid: string[][], position: Position) {
  const change = getDirectionChange(direction);
  const i = position.i + change[0];
  const j = position.j + change[1];
  if (
    i < 0 ||
    i >= grid.length ||
    j < 0 ||
    j >= grid.length ||
    grid[i][j] !== grid[position.i][position.j]
  ) {
    return false;
  }
  return true;
}

function getDirectionChange(direction: string) {
  const change = [0, 0];
  if (direction.match(/TOP/i)) {
    change[0] += -1;
  }
  if (direction.match(/BOTTOM/i)) {
    change[0] += 1;
  }
  if (direction.match(/LEFT/i)) {
    change[1] += -1;
  }
  if (direction.match(/RIGHT/i)) {
    change[1] += 1;
  }
  return change;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);

  const grid = readFileTo2DArray(filename);
  const visited = new Set();
  let price = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const position = { i, j };
      if (visited.has(getPositionString(position))) {
        continue;
      }
      const fence = getFence(grid, position);
      fence.visited.forEach((p) => {
        visited.add(p);
      });
      price += fence.area * fence.corners;
    }
  }
  return price;
}

export async function main() {
  console.log(`Hello from day12!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 1930);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 1421958);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 1206);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 885394);
}
