const fs = require("fs");
const path = require("path");

const input = process.argv[2];
if (!input) {
  console.error("Please provide a day number as an argument.");
  process.exit(1);
}

const dayTemplatePath = path.resolve(__dirname, "day_template.mjs");
const newDayFilePath = path.resolve(__dirname, `../days/day${input}.mjs`);
const inputTemplatePath = path.resolve(__dirname, "../../inputs/day_template");
const newInputFolderPath = path.resolve(__dirname, `../../inputs/day${input}`);

// Copy day_template.mjs to ../days/day${input}.mjs
fs.copyFile(dayTemplatePath, newDayFilePath, (err) => {
  if (err) {
    console.error("Error copying day template file:", err);
    process.exit(1);
  }

  // Replace DAY = 1 with DAY = ${input} in the new file
  fs.readFile(newDayFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading new day file:", err);
      process.exit(1);
    }

    const result = data.replace("DAY = 1", `DAY = ${input}`);

    fs.writeFile(newDayFilePath, result, "utf8", (err) => {
      if (err) {
        console.error("Error writing to new day file:", err);
        process.exit(1);
      }
    });
  });
});

// Copy ../../inputs/day_template folder to ../../inputs/day${input}
fs.cp(inputTemplatePath, newInputFolderPath, { recursive: true }, (err) => {
  if (err) {
    console.error("Error copying input template folder:", err);
    process.exit(1);
  }
});
