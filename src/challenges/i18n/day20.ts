import assert from "assert";
import { readFile } from "@shared/fileReader";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const fileContent = await readFile(filename);
  const replaced = fileContent.replace(/\n/g, "");
  const b64 = Buffer.from(replaced, "base64");
  const utf16 = b64.subarray(2).toString("utf16le");
  const bits20 = decode20bits(utf16);
  const bits8 = regroupInto8s(bits20);
  const utf8ish = utf8Group(bits8);
  const bytes = bitsToBytes(utf8ish);
  const result = Buffer.from(bytes).toString("utf8");
  return result;
}

function bitsToBytes(bits: string) {
  return bits.match(/.{1,8}/g)?.map((b) => parseInt(b, 2)) ?? [];
}

function decode20bits(textInUtf16: string) {
  return [...textInUtf16]
    .map((c) => c.codePointAt(0)!.toString(2).padStart(20, "0"))
    .join("");
}

function regroupInto8s(bits20: string) {
  return bits20.match(/.{1,8}/g) ?? [];
}

function utf8Group(arrOfBits: string[]) {
  let i = 0;
  let result = "";
  while (i < arrOfBits.length) {
    const jumpSize = arrOfBits[i].split("0")[0].length;
    let res = arrOfBits[i].slice(jumpSize);
    for (let j = 1; j < jumpSize; j++) {
      i++;
      res += arrOfBits[i].slice(2);
    }
    res = ("0".repeat(Math.max(28 - res.length, 0)) + res).slice(-28);
    i++;
    result += res;
  }
  return result;
}

export async function main() {
  console.log(`Hello from day20!`);
  const input1Result = await solve("input1.txt");
  assert.ok(
    input1Result,
    "ꪪꪪꪪ This is a secret message. ꪪꪪꪪ Good luck decoding me! ꪪꪪꪪ"
  );
  const input2Result = await solve("input2.txt");
  console.log(input2Result);
}
