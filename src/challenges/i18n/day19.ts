import assert from "assert";
import { getRlInterface } from "@shared/fileReader";
import moment from "moment-timezone";
import * as fs from "fs";
import * as path from "path";

const tzVersions = ["2018c", "2018g", "2021b", "2023d"];

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const tzData = readTzData("2018g");
  moment.tz.load(tzData);
  const data = [];

  for await (const line of rl) {
    const [localTime, timezone] = line.split(";");
    data.push([localTime, timezone.trim()]);
    const utcTime = moment
      .tz(localTime, "YYYY-MM-DD HH:mm:ss", timezone.trim())
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");
    console.log(
      `Local time: ${localTime}, Timezone: ${timezone}`,
      `UTC time: ${utcTime}`
    );
  }

  const scores: Record<string, number> = {};

  for (const tzVersion of tzVersions) {
    const tzData = readTzData(tzVersion);
    moment.tz.load(tzData);
    for (const [localTime, timezone] of data) {
      const utcTime = moment
        .tz(localTime, "YYYY-MM-DD HH:mm:ss", timezone)
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss+00:00");
      scores[utcTime] = (scores[utcTime] || 0) + 1;
      console.log(
        `Local time: ${localTime}, Timezone: ${timezone}`,
        `UTC time: ${utcTime}`
      );
    }
  }
  //console.log(scores);
  // Find the entry in scores with the maximum value
  let maxScore = 0;
  let maxUTCTime = "";

  for (const [utcTime, count] of Object.entries(scores)) {
    if (count > maxScore) {
      maxScore = count;
      maxUTCTime = utcTime;
    }
  }
  return maxUTCTime;
}

function readTzData(timezone: string) {
  try {
    const data = fs.readFileSync(
      path.join("src/challenges/i18n/day19", `${timezone}.json`),
      "utf8"
    );
    const tzData = JSON.parse(data);
    return tzData;
  } catch (error) {
    console.error(`Error reading timezone data for ${timezone}:`, error);
    return null;
  }
}

export async function main() {
  console.log(`Hello from day19!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, "2024-04-09T17:49:00+00:00");
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, "2024-04-13T13:04:00+00:00");
}
