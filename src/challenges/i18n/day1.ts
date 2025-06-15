import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solve(filename: string) {
  console.log("Solving part one of file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  for await (const line of rl) {
    score += getCost(line);
  }
  return score;
}

function getCost(line: string) {
  const sms = isValidForSms(line);
  const twitter = isValidForTwitter(line);
  if (sms && twitter) {
    return 13;
  } else if (sms) {
    return 11;
  } else if (twitter) {
    return 7;
  } else {
    return 0;
  }
}

function isValidForSms(line: string) {
  const bytes = new TextEncoder().encode(line).length;
  return bytes <= 160;
}

function isValidForTwitter(line: string) {
  return line.length <= 140;
}

export async function main() {
  console.log(`Hello from day1!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 31);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 107989);
}
