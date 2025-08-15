import { decodeBytes } from "@shared/i18n";
import type { Block } from "./Block";
import { UNIT_HEIGHT } from "./BlockUnit";

export class PuzzleGrid {
  blocks: Block[];
  height: number;
  width: number;
  grid: string[][];
  availableBlocks: Block[];
  constructor(blocks: Block[]) {
    this.blocks = blocks;
    this.availableBlocks = blocks;
    this.height = blocks
      .filter((block) => block.left)
      .reduce((acc, block) => acc + block.height, 0);
    this.width = blocks.filter((block) => block.top).length;
    this.grid = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(""));
  }

  printDecodedGrid() {
    console.log("Decoded Grid:");
    const decodedGrid = this.getDecodedGrid();
    decodedGrid.forEach((line) => {
      console.log(line);
    });
  }

  getSolutionCoordinates() {
    const decodedGrid = this.getDecodedGrid();
    for (let i = 0; i < decodedGrid.length; i++) {
      const row = [...decodedGrid[i]];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === "╳") {
          return { i, j };
        }
      }
    }
  }

  getDecodedGrid() {
    const gridBytes: string[] = [];
    const decodedGrid: string[] = [];
    let rowIndex = 0;
    this.grid.forEach((row) => {
      row.forEach((cell) => {
        const [blockId, unitIndex] = cell.split("/");
        const blockUnit = this.blocks.find((b) => b.id === parseInt(blockId))
          ?.units[parseInt(unitIndex)]!;
        for (let i = 0; i < UNIT_HEIGHT; i++) {
          const index = UNIT_HEIGHT * rowIndex + i;
          if (!gridBytes[index]) {
            gridBytes[index] = "";
          }
          gridBytes[index] += blockUnit.bytes[i].join("");
        }
      });
      rowIndex++;
    });
    for (const line of gridBytes) {
      const lineBytes = [];
      for (let i = 0; i < line.length - 1; i = i + 2) {
        lineBytes.push(line.substring(i, i + 2));
      }
      const decodedText = decodeBytes(lineBytes);
      decodedGrid.push(decodedText);
    }
    return decodedGrid;
  }

  printGrid() {
    console.log("Grid:");
    this.grid.forEach((row) => {
      console.log(row.map((cell) => cell.padStart(5, " ")).join(" | "));
    });
  }

  solve() {
    while (this.availableBlocks.length > 0) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (
            this.grid[y][x] === "" &&
            ((x - 1 >= 0 && this.grid[y][x - 1] !== "") ||
              (x + 1 < this.width && this.grid[y][x + 1] !== ""))
          ) {
            const block = this.availableBlocks.find((b) =>
              this.doesBlockFit(b, x, y)
            );
            if (block) {
              this.placeBlock(block, x, y);
              x = 0;
              y = 0;
            }
          }
        }
      }
    }
  }

  doesBlockFit(block: Block, x: number, y: number) {
    if (
      (x === 0 && !block.left) ||
      (x === this.width - 1 && !block.right) ||
      (y === 0 && !block.top) ||
      (y === this.height - 1 && !block.bottom) ||
      y + block.height > this.height
    ) {
      return false;
    }
    for (let i = 0; i < block.height; i++) {
      if (this.grid[y + i][x] !== "") {
        return false;
      }
      const checkNeighborFit = (neighborPos: number) => {
        if (
          neighborPos >= 0 &&
          neighborPos < this.width &&
          this.grid[y + i][neighborPos] !== ""
        ) {
          const [neighborId, neighborUnitIdx] =
            this.grid[y + i][neighborPos].split("/");
          const neighborBlock = this.blocks.find(
            (b) => b.id === parseInt(neighborId)
          )!;
          const neighborUnit = neighborBlock.units[parseInt(neighborUnitIdx)];

          return neighborPos < x
            ? neighborUnit.canFitToRight(block.units[i])
            : block.units[i].canFitToRight(neighborUnit);
        }
        return true;
      };

      if (!checkNeighborFit(x - 1) || !checkNeighborFit(x + 1)) {
        return false;
      }
    }
    return true;
  }

  placeBlock(block: Block, x: number, y: number) {
    for (let i = 0; i < block.height; i++) {
      if (this.grid[y + i][x] !== "") {
        throw new Error(
          `Block ${block.id} overlaps at position (${x}, ${y + i})`
        );
      }
      this.grid[y + i][x] = `${block.id}/${i}`;
    }
    this.availableBlocks = this.availableBlocks.filter(
      (b) => b.id !== block.id
    );
  }

  // prettier-ignore
  placeCornerBlocks() {
    const topLeftBlock = this.availableBlocks.find((block) => block.top && block.left)!;
    const topRightBlock = this.availableBlocks.find((block) => block.top && block.right)!;
    const bottomLeftBlock = this.availableBlocks.find((block) => block.bottom && block.left)!;
    const bottomRightBlock = this.availableBlocks.find((block) => block.bottom && block.right)!;
    this.placeBlock(topLeftBlock, 0, 0);
    this.placeBlock(topRightBlock, this.grid[0].length - 1, 0);
    this.placeBlock(bottomLeftBlock, 0, this.grid.length - bottomLeftBlock.height);
    this.placeBlock(bottomRightBlock, this.grid[0].length - 1, this.grid.length - bottomRightBlock.height);
  }
}
