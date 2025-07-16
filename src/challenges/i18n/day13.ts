import assert from "assert";
import { getRlInterface } from "@shared/fileReader";

async function solve(filename: string) {
  console.log("Solving file:", filename);

  const rl = getRlInterface(filename);
  let readWords = true;
  let score = 0;
  const words: string[] = [];

  for await (const line of rl) {
    if (line === "") {
      readWords = false;
      continue;
    } else if (readWords) {
      const word = line.trim();
      const { encoding, normalizedWord } = getEncoding(word);
      const decodedWord = decodeText(normalizedWord, encoding);
      // console.log(
      //   `Original word: ${word}, Encoding: ${encoding}, Decoded word: ${decodedWord}`
      // );
      words.push(decodedWord);
    } else {
      const regex = new RegExp(`^${line.trim()}$`);
      for (let i = 0; i < words.length; i++) {
        if (regex.test(words[i])) {
          score += i + 1;
        }
      }
    }
  }
  return score;
}

function getEncoding(text: string): {
  encoding: BufferEncoding;
  normalizedWord: string;
} {
  if (text.startsWith("efbbbf")) {
    return { encoding: "utf8", normalizedWord: text.slice(6) };
  } else if (text.startsWith("fffe")) {
    return { encoding: "utf16le", normalizedWord: text.slice(4) };
  } else if (text.startsWith("feff")) {
    return {
      encoding: "utf16le",
      normalizedWord: convertBEtoLE(text.slice(4)),
    };
  } else if (text.match("00")) {
    const indexOf00 = text.indexOf("00");
    if (indexOf00 % 4 === 0) {
      return {
        encoding: "utf16le",
        normalizedWord: convertBEtoLE(text),
      };
    } else {
      return { encoding: "utf16le", normalizedWord: text };
    }
  } else if (isUTF8(text)) {
    return { encoding: "utf8", normalizedWord: text };
  } else {
    return { encoding: "latin1", normalizedWord: text };
  }
}

function isUTF8(text: string) {
  const decoded = decodeText(text, "utf8");
  for (const char of decoded.normalize("NFC")) {
    if (char.toLowerCase() === char.toUpperCase()) {
      // This character is not a letter, so it is not UTF-8
      return false;
    }
  }
  return true;
}

function convertBEtoLE(text: string) {
  const bytes = text.match(/.{1,2}/g);
  if (!bytes) return text;
  for (let i = 0; i < bytes.length; i += 2) {
    if (i + 1 < bytes.length) {
      [bytes[i], bytes[i + 1]] = [bytes[i + 1], bytes[i]];
    }
  }
  return bytes.join("");
}

function getBytes(text: string) {
  return text.match(/.{1,2}/g)?.map((byte) => `0x${byte}`) || [];
}

function decodeText(text: string, encoding: BufferEncoding) {
  const bytes = getBytes(text);
  const byteArray = bytes.map((hex) => parseInt(hex, 16));
  return Buffer.from(byteArray).toString(encoding);
}

export async function main() {
  console.log(`Hello from day13!`);
  const input1Result = await solve("input1.txt");
  assert.strictEqual(input1Result, 47);
  const input2Result = await solve("input2.txt");
  assert.strictEqual(input2Result, 8722);
}
