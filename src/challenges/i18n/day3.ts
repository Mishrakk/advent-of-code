import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    if (isValidPassword(line)) {
      score++;
    }
  }
  return score;
}

function isValidPassword(password: string) {
  if (password.length < 4 || password.length > 12) {
    return false;
  }
  if (!/\d/.test(password)) {
    return false;
  }
  if (!hasLowercaseChar(password)) {
    return false;
  }
  if (!hasUppercaseChar(password)) {
    return false;
  }
  if (!hasNonAsciiChar(password)) {
    return false;
  }
  return true;
}

function hasLowercaseChar(password: string) {
  return password.split("").some((char) => isLowercase(char));
}

function isLowercase(str: string) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

function hasUppercaseChar(password: string) {
  return password.split("").some((char) => isUppercase(char));
}

function isUppercase(str: string) {
  return str === str.toUpperCase() && str !== str.toLowerCase();
}

function hasNonAsciiChar(password: string) {
  return password.split("").some((char) => !isAscii(char));
}

function isAscii(str: string) {
  return str.charCodeAt(0) < 128;
}

export async function main() {
  console.log(`Hello from day3!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 2);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 509);
}
