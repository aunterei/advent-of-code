import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

const snafuDictionary = new Map<String, number>([
  ['2', 2],
  ['1', 1],
  ['0', 0],
  ['-', -1],
  ['=', -2],
]);

function getByValue<K, V>(map: Map<K, V>, searchValue: V) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
}

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

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
  }

  snafuToDecimal(snafu: string): number {
    let number = 0;

    for (let i = snafu.length - 1; i >= 0; i--) {
      const pow = snafu.length - 1 - i;
      const factor = snafuDictionary.get(snafu[i]);

      number += factor * Math.pow(5, pow);
    }

    return number;
  }

  decimalToSnafu(decimal: number): string {
    let result = '';
    let quotient = decimal;
    debugger;
    while (quotient > 0) {
      const remainder = ((quotient + 2) % 5) - 2;
      quotient = Math.floor((quotient + 2) / 5);
      result = getByValue(snafuDictionary, remainder) + result;
    }
    return result;
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    const total = this.lines.reduce((acc, cur) => {
      return acc + this.snafuToDecimal(cur);
    }, 0);

    const snafuInstruction = this.decimalToSnafu(total);

    logger.result(snafuInstruction);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    const result = 0;
    logger.result(result);
  }
}

const year = '2022';
const day = '25';
const testing = true;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
// resolver.solve2()
