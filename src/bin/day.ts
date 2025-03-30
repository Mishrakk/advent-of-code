async function run() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Usage: ts-node day.ts <challenge> <day>");
    process.exit(1);
  }

  const values = {
    challenge: args[0],
    day: args[1],
  };

  try {
    const module = await import(
      `../challenges/${values.challenge}/day${values.day}.js`
    );
    if (typeof module.main !== "function") {
      throw new Error("Main function not found in module");
    }
    await module.main();
  } catch (error: Error | any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

run().catch(console.error);
