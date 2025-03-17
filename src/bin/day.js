#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

(async () => {
  const args = process.argv.slice(2);
  let firstArg = args[0];
  if (!firstArg) {
    const daysDir = path.resolve(__dirname, "../days");
    const files = fs.readdirSync(daysDir);
    const dayFiles = files.filter(
      (file) => file.startsWith("day") && file.endsWith(".mjs")
    );
    const dayNumbers = dayFiles.map((file) =>
      parseInt(file.match(/day(\d+)\.mjs/)[1], 10)
    );
    const highestDay = Math.max(...dayNumbers);
    firstArg = highestDay.toString();
  }
  const dayPath = `../days/day${firstArg}.mjs`;
  let { main } = await import(dayPath);

  main();
})();
