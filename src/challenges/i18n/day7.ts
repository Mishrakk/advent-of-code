import assert from "assert";
import { getRlInterface } from "@shared/fileReader";
import { Temporal } from "@js-temporal/polyfill";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  let i = 1;

  for await (const line of rl) {
    const [timestamp, correctDuration, wrongDuration] = line.split("\t");
    let localTime: Temporal.ZonedDateTime;
    try {
      // Throws by default if the offset isn't valid at that time for the time zone:
      localTime = Temporal.ZonedDateTime.from(timestamp + "[America/Halifax]");
    } catch {
      localTime = Temporal.ZonedDateTime.from(timestamp + "[America/Santiago]");
    }
    const hour = localTime
      .subtract({ minutes: parseInt(wrongDuration) })
      .add({ minutes: parseInt(correctDuration) }).hour;
    score += hour * i++;
  }
  return score;
}

export async function main() {
  console.log(`Hello from day7!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 866);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 32152346);
}
