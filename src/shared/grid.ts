export function printGrid(grid: string[][], separator = " ") {
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i].join(separator));
  }
  console.log("\n");
}

export function getPosition(grid: string[][], symbol: string) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === symbol) {
        return { i, j };
      }
    }
  }
  return null;
}

export function checkIfInBounds(
  grid: string[][],
  position: { i: number; j: number }
) {
  const height = grid.length;
  const width = grid[0].length;
  return (
    position.i >= 0 &&
    position.i < height &&
    position.j >= 0 &&
    position.j < width
  );
}

export function getAllNeighbors(i: number, j: number) {
  return [
    { i: i - 1, j: j - 1 }, // Top-left
    { i: i - 1, j: j }, // Top
    { i: i - 1, j: j + 1 }, // Top-right
    { i: i, j: j + 1 }, // Right
    { i: i + 1, j: j + 1 }, // Bottom-right
    { i: i + 1, j: j }, // Bottom
    { i: i + 1, j: j - 1 }, // Bottom-left
    { i: i, j: j - 1 }, // Left
  ];
}

export function deepCopyGrid(grid: string[][]): string[][] {
  return grid.map((row) => [...row]);
}
