const fs = require("fs");
const path = require("path");

const challenge = process.argv[2];
if (!challenge) {
  console.error("Please provide a challenge name argument.");
  process.exit(1);
}
const day = process.argv[3];
if (!day) {
  console.error("Please provide a day number argument.");
  process.exit(1);
}

const dayTemplatePath = path.resolve(__dirname, "day_template.mjs");
const newDayFilePath = path.resolve(
  __dirname,
  `../challenges/${challenge}/day${day}.mjs`
);
const inputTemplatePath = path.resolve(
  __dirname,
  `../../inputs/${challenge}/day_template`
);
const newInputFolderPath = path.resolve(
  __dirname,
  `../../inputs/${challenge}/day${day}`
);

// Copy day_template.mjs to ../days/day${input}.mjs
fs.copyFile(dayTemplatePath, newDayFilePath, (err) => {
  if (err) {
    console.error("Error copying day template file:", err);
    process.exit(1);
  }

  // Replace ${day} with value
  fs.readFile(newDayFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading new day file:", err);
      process.exit(1);
    }

    const result = data.replace("${day}", day);

    fs.writeFile(newDayFilePath, result, "utf8", (err) => {
      if (err) {
        console.error("Error writing to new day file:", err);
        process.exit(1);
      }
    });
  });
});

// Copy day_template folder to ../inputs/${challenge}/day${input}
fs.cp(inputTemplatePath, newInputFolderPath, { recursive: true }, (err) => {
  if (err) {
    console.error("Error copying input template folder:", err);
    process.exit(1);
  }
});
