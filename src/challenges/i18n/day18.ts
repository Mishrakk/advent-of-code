import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    const valueWithBidi = getValueWithBidiMarkers(line);
    const valueWithoutBidi = getValueWithoutBidiMarkers(line);
    score += Math.abs(valueWithBidi - valueWithoutBidi);
  }
  return score;
}

function getHighestEmbeddingLevel(levels: number[]) {
  return Math.max(...levels);
}

function handleBidiMarkers(line: string) {
  const levels = getEmbeddingLevels(line);
  const tokens = [...line];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (
      t === "\u2067" ||
      t === "\u2066" ||
      t === "\u2069" ||
      t === "⏴" ||
      t === "⏵" ||
      t === "⏶"
    ) {
      tokens.splice(i, 1);
      levels.splice(i, 1);
      i--; // Adjust index since we removed an element
    }
  }
  const highestLevel = getHighestEmbeddingLevel(levels);
  for (let i = highestLevel; i > 0; i--) {
    const stretches = getStretches(i, levels);
    for (const [start, end] of stretches) {
      const reversed = tokens.slice(start, end + 1).reverse();
      tokens.splice(start, end - start + 1, ...reversed);
      for (let j = start; j <= end; j++) {
        levels[j]--;
        if (tokens[j] === "(") {
          tokens[j] = ")";
        } else if (tokens[j] === ")") {
          tokens[j] = "(";
        }
      }
    }
  }
  return tokens.join("");
}

function getStretches(level: number, levels: number[]) {
  const stretches: [number, number][] = [];
  let start = -1;

  for (let i = 0; i < levels.length; i++) {
    if (levels[i] === level) {
      if (start === -1) start = i;
    } else {
      if (start !== -1) {
        stretches.push([start, i - 1]);
        start = -1;
      }
    }
  }

  if (start !== -1) {
    stretches.push([start, levels.length - 1]);
  }

  return stretches;
}

function visualizeLine(line: string) {
  const levels = getEmbeddingLevels(line);
  const highlightedLine = highlightBidiMarkers(line);
  console.log(highlightedLine);
  console.log(levels.join(""));
}

function getEmbeddingLevels(line: string) {
  const levels = [];
  let leftToRight = true;
  let currentLevel = 0;

  for (const char of [...line]) {
    if (char === "\u2067" || char === "⏴") {
      levels.push(currentLevel);
      leftToRight = false;
      currentLevel++;
    } else if (char === "\u2066" || char === "⏵") {
      levels.push(currentLevel);
      leftToRight = true;
      currentLevel++;
    } else if (char === "\u2069" || char === "⏶") {
      currentLevel = Math.max(0, currentLevel - 1);
      levels.push(currentLevel);
    } else if (char.match(/\d/) && currentLevel % 2 === 1) {
      levels.push(currentLevel + 1);
    } else {
      levels.push(currentLevel);
    }
  }

  return levels;
}

function getValueWithBidiMarkers(line: string) {
  const expression = handleBidiMarkers(line);
  return eval(expression);
}

function getValueWithoutBidiMarkers(line: string) {
  const strippedLine = stripBidiMarkers(line);
  return eval(strippedLine);
}

function highlightBidiMarkers(line: string) {
  return line.replace(/[\u2067\u2066\u2069]/g, (match) => {
    switch (match) {
      case "\u2067":
        return "⏴";
      case "\u2066":
        return "⏵";
      case "\u2069":
        return "⏶";
      default:
        return match;
    }
  });
}

function stripBidiMarkers(line: string) {
  return line.replace(/[\u2067\u2066\u2069]/g, "");
}

export async function main() {
  console.log(`Hello from day18!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 19282);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 126415099);
}
