#!/usr/bin/env node
import fs from "fs";
import readline from "readline";

export function getRlInterface(day, filename) {
  const path = getFullPath(day, filename);
  return readline.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity,
  });
}

export function readFileTo2DArray(day, filename) {
  const path = getFullPath(day, filename);
  const fileContent = fs.readFileSync(path, "utf-8").replace(/\r\n/g, "\n");
  const lines = fileContent.split("\n");
  return lines.map((line) => line.split(""));
}

export function readFile(day, filename) {
  const path = getFullPath(day, filename);
  return fs.readFileSync(path, "utf-8");
}

function getFullPath(day, filename) {
  return `inputs/day${day}/${filename}`;
}

export function saveToFile(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

export function getAllNumbersInFile(day, filename) {
  const file = readFile(day, filename);
  return file.match(/-?\d+/g).map(Number);
}
