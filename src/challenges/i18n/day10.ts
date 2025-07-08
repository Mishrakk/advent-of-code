import assert from "assert";
import { getRlInterface } from "@shared/fileReader";
import * as bcrypt from "bcrypt";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let score = 0;

  const userHashes: Record<string, string> = {};
  let readLoginAttempts = false;

  for await (const line of rl) {
    if (line === "") {
      readLoginAttempts = true;
      continue;
    } else if (readLoginAttempts) {
      const [username, password] = line.split(" ");
      const hash = userHashes[username];
      if (checkIfValidLogin(password, hash)) {
        score++;
      }
    } else {
      const [username, hash] = line.split(" ");
      userHashes;
      if (userHashes[username]) {
        throw new Error(`Duplicate user found: ${username}`);
      } else {
        userHashes[username] = hash;
      }
    }
  }
  return score;
}

function checkIfValidLogin(password: string, hash: string) {
  let permutations = [""];
  const normalizedPassword = password.normalize("NFC");
  for (let i = 0; i < normalizedPassword.length; i++) {
    const char = normalizedPassword[i];
    const newPermutations: string[] = [];
    for (const perm of permutations) {
      newPermutations.push(perm + char);
      if (char.normalize("NFD") !== char) {
        newPermutations.push(perm + char.normalize("NFD"));
      }
    }
    permutations = newPermutations;
  }
  for (const perm of permutations) {
    if (bcrypt.compareSync(perm, hash)) {
      return true;
    }
  }
  return false;
}

export async function main() {
  console.log(`Hello from day10!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 4);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 2030);
}
