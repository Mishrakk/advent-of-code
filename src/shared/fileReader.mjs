#!/usr/bin/env node
import fs from "fs";
import readline from "readline";

export function getRlInterface(filename) {
  const callerFile = new Error().stack
    .split("\n")[2]
    .match(/\((.*):\d+:\d+\)/)[1];
  const path = getFullPath(callerFile, filename);
  return readline.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity,
  });
}

export function readFileTo2DArray(filename) {
  const callerFile = new Error().stack
    .split("\n")[2]
    .match(/\((.*):\d+:\d+\)/)[1];
  const path = getFullPath(callerFile, filename);
  const fileContent = fs.readFileSync(path, "utf-8").replace(/\r\n/g, "\n");
  const lines = fileContent.split("\n");
  return lines.map((line) => line.split(""));
}

export function readFile(filename) {
  const callerFile = new Error().stack
    .split("\n")[2]
    .match(/\((.*):\d+:\d+\)/)[1];
  const path = getFullPath(callerFile, filename);
  return fs.readFileSync(path, "utf-8");
}

export function saveToFile(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function getChallengeAndDay(callerFile) {
  const match = callerFile.match(/challenges\/([^/]+)\/day([^/]+)\.mjs/);
  if (!match) {
    throw new Error("Could not determine challenge and day from caller file");
  }
  return { challenge: match[1], day: match[2] };
}

function getFullPath(callerFile, filename) {
  const { challenge, day } = getChallengeAndDay(callerFile);
  return `inputs/${challenge}/day${day}/${filename}`;
}
