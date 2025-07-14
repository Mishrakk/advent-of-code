import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

interface entry {
  firstName: string;
  lastName: string;
  number: number;
}

const englishReplacements: Record<string, string> = {
  ı: "i",
  æ: "ae",
  "-": "",
  " ": "",
  í: "i",
  á: "a",
  å: "a",
  ñ: "n",
  ö: "o",
  ä: "a",
  ø: "o",
  "'": "",
  ç: "c",
  ó: "o",
  ü: "u",
  ú: "u",
  é: "e",
  ğ: "g",
  ş: "s",
};

const swedishReplacements: Record<string, string> = {
  ...englishReplacements,
  å: "å",
  ä: "ä",
  ö: "ö",
  æ: "ä",
  ø: "ö",
};

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 1;
  const entries: entry[] = [];

  for await (const line of rl) {
    const match = line.match(/([^,]+),\s+([^:]+):\s+(\d+)/);
    if (match) {
      const firstName = match[2].trim();
      const lastName = match[1].trim();
      const number = parseInt(match[3], 10);
      entries.push({ firstName, lastName, number });
    }
  }
  const middleIndex = Math.floor(entries.length / 2);
  const englishEntries = entries.map((e) =>
    normalizeEntry(e, normalizeNameEnglish)
  );
  englishEntries.sort(entryCompare);
  score *= englishEntries[middleIndex].number;

  const swedishEntries = entries.map((e) =>
    normalizeEntry(e, normalizeNameSwedish)
  );
  swedishEntries.sort((a, b) => entryCompare(a, b, "sv-SE"));
  score *= swedishEntries[middleIndex].number;

  const dutchEntries = entries.map((e) =>
    normalizeEntry(e, normalizeNameDutch)
  );
  dutchEntries.sort(entryCompare);
  score *= dutchEntries[middleIndex].number;

  return score;
}

function entryCompare(a: entry, b: entry, locale = "en-US") {
  const lastNameComparison = a.lastName.localeCompare(b.lastName, locale);
  if (lastNameComparison !== 0) {
    return lastNameComparison;
  }
  return a.firstName.localeCompare(b.firstName, locale);
}

function normalizeEntry(
  e: entry,
  normalizationFunction: (name: string) => string
): entry {
  return {
    firstName: normalizationFunction(e.firstName),
    lastName: normalizationFunction(e.lastName),
    number: e.number,
  };
}

function normalizeNameEnglish(name: string) {
  let normalized = name.toLowerCase().trim();
  for (const [key, value] of Object.entries(englishReplacements)) {
    normalized = normalized.replace(new RegExp(key, "g"), value);
  }
  if (normalized.match(/[^a-z]/)) {
    throw new Error(`Non-english characters found: ${normalized}`);
  }
  return normalized;
}

function normalizeNameSwedish(name: string) {
  let normalized = name.toLowerCase().trim();
  for (const [key, value] of Object.entries(swedishReplacements)) {
    normalized = normalized.replace(new RegExp(key, "g"), value);
  }
  if (normalized.match(/[^a-zåäö]/)) {
    throw new Error(`Non-swedish characters found: ${normalized}`);
  }
  return normalized;
}

function normalizeNameDutch(name: string) {
  let normalized = removeInfixes(name).toLowerCase().trim();
  for (const [key, value] of Object.entries(englishReplacements)) {
    normalized = normalized.replace(new RegExp(key, "g"), value);
  }
  if (normalized.match(/[^a-z]/)) {
    throw new Error(`Non-english characters found: ${normalized}`);
  }
  return normalized;
}

function removeInfixes(str: string) {
  const parts = str.split(" ");
  return parts
    .filter((part) => !startsWithLowercase(part))
    .join(" ")
    .trim();
}

function startsWithLowercase(str: string) {
  return str[0] === str[0].toLowerCase() && str[0] !== str[0].toUpperCase();
}

export async function main() {
  console.log(`Hello from day12!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 1885816494308838);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 4346832835083875);
}
