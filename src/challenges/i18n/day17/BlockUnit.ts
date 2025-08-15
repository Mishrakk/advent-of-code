import { decodeBytes } from "@shared/i18n";

export const UNIT_HEIGHT = 4;

export class BlockUnit {
  bytes: string[][];
  decodedLines: string[];
  leftEdge: number[] = [];
  rightEdge: number[] = [];

  constructor(bytes: string[][], decodedLines: string[]) {
    this.bytes = bytes;
    this.decodedLines = decodedLines;
    for (let i = 0; i < UNIT_HEIGHT; i++) {
      let continueCount = 0;
      while (
        continueCount < this.bytes[i].length &&
        this.isUtf8ContinuationByte(this.bytes[i][continueCount])
      ) {
        continueCount++;
      }
      this.leftEdge.push(continueCount);

      let missingContinuationBytes = 0;
      for (let fromEnd = 1; fromEnd < 5; fromEnd++) {
        const currentByte = this.bytes[i][this.bytes[i].length - fromEnd];
        if (
          !this.isUtf8ContinuationByte(currentByte) &&
          !this.isUtf8LeadByte(currentByte)
        ) {
          break;
        }
        if (this.isUtf8LeadByte(currentByte)) {
          missingContinuationBytes = this.expectedBytes(currentByte) - fromEnd;
          break;
        }
      }
      this.rightEdge.push(missingContinuationBytes);
    }
  }

  private isUtf8LeadByte(byte: string) {
    const value = parseInt(byte, 16);
    return value >= 0b1100_0000 && value <= 0b1111_0111;
  }

  // Determine the number of expected continuation bytes for a given UTF-8 lead byte
  private expectedBytes(byte: string) {
    const value = parseInt(byte, 16);
    if (value >= 0b1100_0000 && value <= 0b1101_1111) {
      return 2;
    }
    if (value >= 0b1110_0000 && value <= 0b1110_1111) {
      return 3;
    }
    if (value >= 0b1111_0000 && value <= 0b1111_0111) {
      return 4;
    }
    return 1;
  }

  private isUtf8ContinuationByte(byte: string) {
    const value = parseInt(byte, 16);
    return value >= 0b1000_0000 && value < 0b1011_1111;
  }

  canFitToRight(rightBlock: BlockUnit) {
    for (let i = 0; i < UNIT_HEIGHT; i++) {
      if (this.rightEdge[i] !== rightBlock.leftEdge[i]) {
        return false;
      }
    }
    for (let i = 0; i < UNIT_HEIGHT; i++) {
      const bytes = [...this.bytes[i], ...rightBlock.bytes[i]];
      const decoded = decodeBytes(bytes);
      const trimmed = decoded.replace(/^�+/, "").replace(/�+$/, "");
      if (trimmed.includes("�")) {
        return false;
      }
    }
    return true;
  }
}
