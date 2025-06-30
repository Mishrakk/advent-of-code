import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

const utf8Decoder = new TextDecoder("utf-8");

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;
  const listOfWords = [];

  for await (const line of rl) {
    if (line.trim() === "") {
      continue;
    } else if (line.match(/^\s*\.+/)) {
      const regex = new RegExp(`^${line.trim()}$`);
      for (let i = 0; i < listOfWords.length; i++) {
        if (regex.test(listOfWords[i])) {
          score += i + 1;
        }
      }
    } else {
      listOfWords.push(getEntry(line, listOfWords.length));
    }
  }
  return score;
}

function getEntry(line: string, length: number) {
  let entry = line;
  if ((length + 1) % 3 === 0) {
    entry = fixEncoding(entry);
  }
  if ((length + 1) % 5 === 0) {
    entry = fixEncoding(entry);
  }
  return entry;
}

function fixEncoding(line: string) {
  return utf8Decoder.decode(
    new Uint8Array([...line].map((c) => c.charCodeAt(0)))
  );
}

export async function main() {
  console.log(`Hello from day6!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 50);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 0);
}
