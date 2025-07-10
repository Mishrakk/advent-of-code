import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

const greekAlphabet = "αβγδεζηθικλμνξοπρστυφχψω";
const greekAlphabetMap = Object.fromEntries(
  [...greekAlphabet].map((char, index) => [char, index])
);
const oIndex = greekAlphabetMap["ο"];

const odysseusVariants = [
  "οδυσσευσ",
  "οδυσσεωσ",
  "οδυσσει",
  "οδυσσεα",
  "οδυσσευ",
];

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    const words = line.split(" ");
    for (const word of words) {
      score += getRotationsToOdysseus(word);
    }
  }
  return score;
}

function getRotationsToOdysseus(word: string) {
  const normalizedWord = word
    .normalize()
    .toLowerCase()
    .replaceAll("ς", "σ")
    .split("")
    .filter((char) => greekAlphabetMap[char] !== undefined)
    .join("");
  if (normalizedWord.length < 7 || normalizedWord.length > 8) {
    return 0;
  }
  if (normalizedWord[3] !== normalizedWord[4]) {
    return 0;
  }
  const shift = oIndex - greekAlphabetMap[normalizedWord[0]];
  const shiftedWord = getShiftedWord(normalizedWord, shift);
  if (isOdysseus(shiftedWord)) {
    return (shift + greekAlphabet.length) % greekAlphabet.length;
  }
  return 0;
}

function isOdysseus(word: string) {
  for (const variant of odysseusVariants) {
    if (word === variant) {
      return true;
    }
  }
  return false;
}

function getShiftedWord(word: string, shift: number) {
  return [...word]
    .map((char) => {
      const index = greekAlphabetMap[char];
      if (index === undefined) {
        return char; // Non-Greek character, return as is
      }
      const shiftedIndex =
        (index + shift + greekAlphabet.length) % greekAlphabet.length;
      return greekAlphabet[shiftedIndex];
    })
    .join("");
}

export async function main() {
  console.log(`Hello from day11!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 19);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 496);
}
