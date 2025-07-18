import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

const unitValues: Record<string, number> = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  百: 100,
  千: 1000,
  万: 10000,
  億: 100000000,
};

const unitsOfLength: Record<string, { mult: number; div: number }> = {
  尺: { mult: 1 * 10, div: 33 },
  間: { mult: 6 * 10, div: 33 },
  丈: { mult: 10 * 10, div: 33 },
  町: { mult: 360 * 10, div: 33 },
  里: { mult: 12960 * 10, div: 33 },
  毛: { mult: 10, div: 33 * 10000 },
  厘: { mult: 10, div: 33 * 1000 },
  分: { mult: 10, div: 33 * 100 },
  寸: { mult: 10, div: 33 * 10 },
};

const multipliers = [100000000, 10000, 1000, 100, 10];

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    const [left, right] = line.split(" × ");

    const leftValue = getDecimalValue(left);
    const rightValue = getDecimalValue(right);
    const curr = leftValue * rightValue;
    score += leftValue * rightValue;
  }
  return score;
}

function getDecimalValue(japaneseValue: string) {
  const numericValue = convertToNumber(japaneseValue.slice(0, -1));
  const areaUnitValue = unitsOfLength[japaneseValue.slice(-1)];
  return (numericValue * areaUnitValue.mult) / areaUnitValue.div;
}

function convertToNumber(original: string) {
  const numericArray = getNumericArray(original);
  return recursiveConvertToNumber(numericArray);
}

function recursiveConvertToNumber(numbers: number[]) {
  if (numbers.length === 0) {
    return 1;
  }
  let result = 0;
  let startIndex = 0;
  for (const multiplier of multipliers) {
    const index = numbers.findIndex(
      (value, idx) => value === multiplier && idx >= startIndex
    );
    if (index == -1) {
      continue;
    }
    const coefficients = numbers.slice(startIndex, index);
    const coefficient = recursiveConvertToNumber(coefficients);
    result += coefficient * multiplier;
    startIndex = index + 1;
  }
  result += numbers.slice(startIndex).reduce((acc, value) => acc + value, 0);
  return result;
}

function getNumericArray(original: string) {
  return [...original].map((char) => {
    if (unitValues[char] !== undefined) {
      return unitValues[char];
    } else {
      throw new Error(`Unknown character: ${char}`);
    }
  });
}

export async function main() {
  console.log(`Hello from day14!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 2177741195);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 130675442686);
}
