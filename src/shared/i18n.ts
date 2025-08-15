export function decodeBytes(bytes: string[]): string {
  const byteArray = bytes.map((hex) => parseInt(hex, 16));
  return Buffer.from(byteArray).toString("utf8");
}
