import { getRlInterface } from "@shared/fileReader";
import assert from "assert";

async function solvePartOne(filename: string) {
  console.log("Solving part one of file:", filename);
  let correctReports = 0;

  const rl = getRlInterface(filename);

  for await (const line of rl) {
    const report = line.split(" ");
    if (isReportCorrect(report)) {
      correctReports++;
    }
  }

  console.log("Correct reports:", correctReports);
  return correctReports;
}

async function solvePartTwo(filename: string) {
  console.log("Solving part two of file:", filename);
  let correctReports = 0;

  const rl = getRlInterface(filename);

  for await (const line of rl) {
    const report = line.split(" ");
    if (isReportCorrect(report) || canReportBeFixed(report)) {
      correctReports++;
    }
  }

  console.log("Correct reports:", correctReports);
  return correctReports;
}

function isReportCorrect(report: string[]) {
  for (let i = 1; i < report.length - 1; i++) {
    const previous = Number(report[i - 1]);
    const current = Number(report[i]);
    const next = Number(report[i + 1]);
    const isCorrect = isLevelCorrect(previous, current, next);
    if (!isCorrect) {
      return false;
    }
  }
  return true;
}

function isLevelCorrect(previous: number, current: number, next: number) {
  const diffPrev = current - previous;
  const diffNext = next - current;
  if (Math.abs(diffPrev) > 3 || Math.abs(diffNext) > 3) {
    return false;
  }
  return diffPrev * diffNext > 0;
}

function canReportBeFixed(report) {
  for (let i = 0; i < report.length; i++) {
    const newReport = report.slice(0, i).concat(report.slice(i + 1));
    if (isReportCorrect(newReport)) {
      return true;
    }
  }
  return false;
}

export async function main() {
  console.log(`Hello from day2!`);
  const input1Part1Result = await solvePartOne("input1.txt");
  assert.strictEqual(input1Part1Result, 2);
  const input2Part1Result = await solvePartOne("input2.txt");
  assert.strictEqual(input2Part1Result, 572);
  const input1Part2Result = await solvePartTwo("input1.txt");
  assert.strictEqual(input1Part2Result, 4);
  const input2Part2Result = await solvePartTwo("input2.txt");
  assert.strictEqual(input2Part2Result, 612);
}
