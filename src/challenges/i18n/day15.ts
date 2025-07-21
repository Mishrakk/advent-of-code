import assert from "assert";
import { getRlInterface } from "@shared/fileReader";
import { Temporal } from "@js-temporal/polyfill";

const startUTCTime = Temporal.ZonedDateTime.from({
  timeZone: "UTC",
  year: 2022,
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
});

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let readOffices = true;
  let coverage: Record<string, boolean> = {};
  const customersOvertime: number[] = [];

  for await (const line of rl) {
    if (line === "") {
      readOffices = false;
      continue;
    }
    if (readOffices) {
      const [name, timeZone, holidays] = line.split("\t");
      const officeCoverage = getOfficeCoverage(timeZone, holidays);
      coverage = { ...coverage, ...officeCoverage };
    } else {
      const [name, timeZone, holidays] = line.split("\t");
      const customerOvertime = getCustomerOvertime(
        timeZone,
        holidays,
        coverage
      );
      customersOvertime.push(customerOvertime);
    }
  }
  customersOvertime.sort();
  return customersOvertime[customersOvertime.length - 1] - customersOvertime[0];
}

function getCustomerOvertime(
  timeZone: string,
  holidays: string,
  officeCoverage: Record<string, boolean>
) {
  let overtime = 0;
  const holidayMap = transformHolidays(holidays);
  for (
    let currentUTCTime = startUTCTime;
    currentUTCTime.year < 2023;
    currentUTCTime = currentUTCTime.add({ minutes: 30 })
  ) {
    const localTime = currentUTCTime.withTimeZone(timeZone);
    if (
      isWeekend(localTime) ||
      holidayMap[localTime.toPlainDate().toString()]
    ) {
      continue;
    }
    const entry = currentUTCTime.toPlainDateTime().toString();
    if (!officeCoverage[entry]) {
      overtime += 30;
    }
  }
  return overtime;
}

function getOfficeCoverage(timeZone: string, holidays: string) {
  const coverage: Record<string, boolean> = {};
  const holidayMap = transformHolidays(holidays);
  for (
    let currentUTCTime = startUTCTime;
    currentUTCTime.year < 2023;
    currentUTCTime = currentUTCTime.add({ minutes: 30 })
  ) {
    const localTime = currentUTCTime.withTimeZone(timeZone);
    if (
      isWeekend(localTime) ||
      !isInOfficeHours(localTime) ||
      holidayMap[localTime.toPlainDate().toString()]
    ) {
      continue; // Skip times outside of office hours
    }
    const entry = currentUTCTime.toPlainDateTime().toString();
    // if (entry === "2022-04-18T00:00:00") {
    //   debugger;
    // }
    coverage[entry] = true;
  }
  return coverage;
}

function transformHolidays(holidays: string) {
  const holidayMap: Record<string, boolean> = {};

  if (!holidays) return holidayMap;

  const holidayDates = holidays.split(";");

  for (const holiday of holidayDates) {
    const [day, month, year] = holiday.split(" ");
    const date = `${year}-${getMonthNumber(month)}-${day.padStart(2, "0")}`;
    holidayMap[date] = true;
  }

  return holidayMap;
}

function getMonthNumber(month: string) {
  const months: Record<string, string> = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  return months[month];
}

function isWeekend(date: Temporal.ZonedDateTime) {
  return date.dayOfWeek === 6 || date.dayOfWeek === 7; // Saturday or Sunday
}

function isInOfficeHours(date: Temporal.ZonedDateTime) {
  // Offices are open between 8:30 and 17:00
  if (date.hour < 8 || date.hour >= 17) {
    return false;
  }
  if (date.hour === 8 && date.minute < 30) {
    return false;
  }
  return true;
}

export async function main() {
  console.log(`Hello from day15!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 3030);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 37830);
}
