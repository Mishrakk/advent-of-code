import assert from "assert";
import { getRlInterface } from "@shared/fileReader";
import { Temporal } from "@js-temporal/polyfill";

const dateFormats = ["DMY", "MDY", "YMD", "YDM"];

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const datesByAuthor: Record<string, string[]> = {};
  const authorsWith911: string[] = [];

  for await (const line of rl) {
    const match = line.match(/^(.+): (.+)$/);
    if (match) {
      const [, date, authors] = match;
      const authorList = authors.split(",").map((a) => a.trim());
      for (const author of authorList) {
        if (!datesByAuthor[author]) {
          datesByAuthor[author] = [];
        }
        datesByAuthor[author].push(date);
      }
    }
  }
  for (const author in datesByAuthor) {
    const dates = datesByAuthor[author];
    const format = getFormat(dates);
    if (contains911(dates, format)) {
      authorsWith911.push(author);
    }
  }
  return authorsWith911.sort().join(" ");
}

function getFormat(dates: string[]) {
  for (const format of dateFormats) {
    if (checkIfAllDatesMatchFormat(dates, format)) {
      return format;
    }
  }
  throw new Error("No valid date format found");
}

function checkIfAllDatesMatchFormat(dates: string[], format: string) {
  for (const date of dates) {
    const dateParts = getDateParts(date, format);
    try {
      Temporal.PlainDate.from(dateParts, { overflow: "reject" });
    } catch {
      return false;
    }
  }
  return true;
}

function getDateParts(date: string, format: string) {
  const parts = date.split("-");
  let year = parts[format.indexOf("Y")];
  const month = parts[format.indexOf("M")];
  const day = parts[format.indexOf("D")];
  if (parseInt(year) < 20) {
    year = "20" + year;
  } else {
    year = "19" + year;
  }
  return {
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
  };
}

function contains911(dates: string[], format: string) {
  for (const date of dates) {
    const dateParts = getDateParts(date, format);
    if (
      dateParts.month === 9 &&
      dateParts.day === 11 &&
      dateParts.year === 2001
    ) {
      return true;
    }
  }
  return false;
}

export async function main() {
  console.log(`Hello from day9!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, "Margot Peter");
  const input2Result = await solve("input2.txt");
  assert.strictEqual(
    input2Result,
    "Amelia Amoura Hugo Jack Jakob Junior Mateo"
  );
}
