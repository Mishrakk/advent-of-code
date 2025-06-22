import assert from "assert";
import { getRlInterface } from "@shared/fileReader";
import { Temporal } from "@js-temporal/polyfill";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  let score = 0;
  const lines = [];
  const rl = getRlInterface(filename);

  for await (const line of rl) {
    if (line.trim() === "") {
      // Skip empty lines
      continue;
    }
    const data = processEntry(line);
    lines.push(data);
  }

  for (let i = 0; i < lines.length - 1; i += 2) {
    const departure = lines[i];
    const arrival = lines[i + 1];

    const flightTime = departure.until(arrival);
    score += flightTime.total({ unit: "minutes" });
  }

  return score;
}

function processEntry(entry: string) {
  const departureMatch = entry.match(/\w+:\s+([^\s]+)\s+(.+)/);
  if (departureMatch) {
    const [_, timeZone, date] = departureMatch;
    const parsedDate = new Date(date);

    return Temporal.ZonedDateTime.from({
      year: parsedDate.getFullYear(),
      month: parsedDate.getMonth() + 1,
      day: parsedDate.getDate(),
      hour: parsedDate.getHours(),
      minute: parsedDate.getMinutes(),
      timeZone,
    });
  } else {
    throw new Error(`No match found for entry: ${entry}`);
  }
}

export async function main() {
  console.log(`Hello from day4!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 3143);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 16451);
}
