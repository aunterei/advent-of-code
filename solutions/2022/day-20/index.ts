import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

interface Byte {
  id: number;
  value: number;
}

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

  encryptedFile: Byte[];

  constructor({
    year,
    day,
    testing,
  }: {
    year: string;
    day: string;
    testing: boolean;
  }) {
    this.year = year;
    this.day = day;
    this.file = parseFile(year, day, testing ? 'test' : 'data');
    this.lines = this.file.split('\n');

    this.encryptedFile = [];
    this.lines.forEach((line, index) =>
      this.encryptedFile.push({ id: index, value: +line })
    );
  }

  decryptFile(encryptedFile: Byte[], iterationCount = 1): Byte[] {
    const decryptedFile: Byte[] = [...encryptedFile];

    for (let i = 0; i < iterationCount; i++) {
      for (const encryptedByte of encryptedFile) {
        const byteIndex = decryptedFile.indexOf(encryptedByte);
        decryptedFile.splice(byteIndex, 1);
        const byteNewIndex =
          (byteIndex + encryptedByte.value) % decryptedFile.length;
        decryptedFile.splice(byteNewIndex, 0, encryptedByte);
      }
    }

    return decryptedFile;
  }

  getGrooveCoordinatesSum(decryptedFile: Byte[]): number {
    const zeroIndex = decryptedFile.findIndex((b) => b.value === 0);
    return (
      decryptedFile[(zeroIndex + 1000) % decryptedFile.length].value +
      decryptedFile[(zeroIndex + 2000) % decryptedFile.length].value +
      decryptedFile[(zeroIndex + 3000) % decryptedFile.length].value
    );
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    const decryptedFile = this.decryptFile(this.encryptedFile);
    logger.result(this.getGrooveCoordinatesSum(decryptedFile));
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    const decryptionKey = 811589153;

    const decryptedFile = this.decryptFile(
      this.encryptedFile.map(({ id, value }) => ({
        id: id,
        value: value * decryptionKey,
      })),
      10
    );
    logger.result(this.getGrooveCoordinatesSum(decryptedFile));
  }
}

const year = '2022';
const day = '20';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
