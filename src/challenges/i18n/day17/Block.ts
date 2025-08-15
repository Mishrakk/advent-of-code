import { decodeBytes } from "@shared/i18n";
import { UNIT_HEIGHT, BlockUnit } from "./BlockUnit";

export class Block {
  bytes: string[][] = [];
  decodedLines: string[] = [];
  top: Boolean;
  bottom: Boolean;
  left: Boolean;
  right: Boolean;
  height: number;
  id: number;
  units: BlockUnit[];
  static nextId = 0;

  constructor(lines: string[]) {
    this.id = Block.nextId++;
    for (const line of lines) {
      const lineBytes = [];
      for (let i = 0; i < line.length - 1; i = i + 2) {
        lineBytes.push(line.substring(i, i + 2));
      }
      this.bytes.push(lineBytes);
      const decodedText = decodeBytes(lineBytes);
      this.decodedLines.push(decodedText);
    }
    const firstLine = this.decodedLines[0];
    const lastLine = this.decodedLines[this.decodedLines.length - 1];
    // prettier-ignore
    this.top = firstLine.startsWith("╔") || firstLine.includes("═-") || firstLine.endsWith("╗");
    // prettier-ignore
    this.bottom = lastLine.startsWith("╚") || lastLine.includes("═-") || lastLine.endsWith("╝");
    // prettier-ignore
    this.left = firstLine.startsWith("╔") || lastLine.startsWith("╚") || firstLine.startsWith("║") || firstLine.startsWith("|");
    // prettier-ignore
    this.right = firstLine.endsWith("╗") || lastLine.endsWith("╝") || firstLine.endsWith("║") || firstLine.endsWith("|");
    this.height = lines.length / UNIT_HEIGHT;
    this.units = this.getUnits();
  }

  private getUnits() {
    const units: BlockUnit[] = [];
    for (let i = 0; i < this.height; i++) {
      const bytes = this.bytes.slice(i * UNIT_HEIGHT, (i + 1) * UNIT_HEIGHT);
      const decodedLines = this.decodedLines.slice(
        i * UNIT_HEIGHT,
        (i + 1) * UNIT_HEIGHT
      );
      units.push(new BlockUnit(bytes, decodedLines));
    }
    return units;
  }
}
