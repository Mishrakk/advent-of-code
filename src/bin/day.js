#!/usr/bin/env node

(async () => {
  const args = process.argv.slice(2);
  const challenge = args[0];
  const day = args[1];
  const solutionPath = `../challenges/${challenge}/day${day}.mjs`;
  let { main } = await import(solutionPath);

  main();
})();
