export function printGrid(grid, separator = " ") {
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i].join(separator));
  }
  console.log("\n");
}

export function getPosition(grid, symbol) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === symbol) {
        return { i, j };
      }
    }
  }
}
