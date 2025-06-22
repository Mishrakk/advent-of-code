import assert from "assert";
import { getRlInterface } from "@shared/fileReader";
import { Temporal } from "@js-temporal/polyfill";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  const events = new Map<number, number>();

  for await (const line of rl) {
    const epochMilliseconds = getTimestampMilliseconds(line);
    if (events.has(epochMilliseconds)) {
      const currentScore = events.get(epochMilliseconds) || 0;
      events.set(epochMilliseconds, currentScore + 1);
    } else {
      events.set(epochMilliseconds, 1);
    }
  }
  for (const [timestamp, count] of events.entries()) {
    if (count >= 4) {
      const date =
        Temporal.Instant.fromEpochMilliseconds(timestamp).toZonedDateTimeISO(
          "UTC"
        );
      return date.toString().slice(0, -5);
    }
  }
}

function getTimestampMilliseconds(line: string) {
  const temporalInstant = Temporal.Instant.from(line);
  return temporalInstant.epochMilliseconds;
}

export async function main() {
  console.log(`Hello from day2!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, "2019-06-05T12:15:00+00:00");
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, "2020-10-25T01:30:00+00:00");
}
