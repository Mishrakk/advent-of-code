import fs from "fs";
import readline from "readline";

export function getRlInterface(filename: string) {
  const errorStack = new Error().stack;
  const path = getFullPath(errorStack, filename);
  return readline.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity,
  });
}

export function readFileTo2DArray(filename: string) {
  const errorStack = new Error().stack;
  const path = getFullPath(errorStack, filename);
  const fileContent = fs.readFileSync(path, "utf-8").replace(/\r\n/g, "\n");
  const lines = fileContent.split("\n");
  return lines.map((line) => line.split(""));
}

export function readFile(filename: string) {
  const errorStack = new Error().stack;
  const path = getFullPath(errorStack, filename);
  return fs.readFileSync(path, "utf-8");
}

export function saveToFile(data: any, filename: string) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function getChallengeAndDay(errorStack: string | undefined) {
  const callerFile = getCallerFile(errorStack);
  const match = callerFile.match(
    /challenges[/\\]([^/\\]+)[/\\]day([^/\\]+)\.ts/
  );
  if (!match) {
    throw new Error("Could not determine challenge and day from caller file");
  }
  return { challenge: match[1], day: match[2] };
}

function getCallerFile(errorStack: string | undefined) {
  if (!errorStack) {
    throw new Error("Could not get stack trace");
  }
  const callerFileMatch = errorStack.split("\n")[2]?.match(/\((.*):\d+:\d+\)/);
  if (!callerFileMatch) {
    throw new Error("Could not parse stack trace");
  }
  return callerFileMatch[1];
}

function getFullPath(errorStack: string | undefined, filename: string) {
  const { challenge, day } = getChallengeAndDay(errorStack);
  return `inputs/${challenge}/day${day}/${filename}`;
}
