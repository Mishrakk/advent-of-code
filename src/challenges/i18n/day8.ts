import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const password of rl) {
    if (isValidPassword(password)) {
      score++;
    }
  }
  return score;
}

function isValidPassword(password: string) {
  if (password.length < 4 || password.length > 12) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  const unaccentedString = getUnaccentedString(password);
  if (!/[aeiou]/i.test(unaccentedString)) {
    return false;
  }
  if (!/[bcdfghjklmnpqrstvwxyz]/i.test(unaccentedString)) {
    return false;
  }
  if (containsDuplicateChars(unaccentedString)) {
    return false;
  }
  return true;
}

function containsDuplicateChars(str: string) {
  const charSet = new Set();
  for (const char of str.toLowerCase()) {
    if (charSet.has(char)) {
      return true;
    }
    charSet.add(char);
  }
  return false;
}

function getUnaccentedString(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function main() {
  console.log(`Hello from day8!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 2);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 0);
}
