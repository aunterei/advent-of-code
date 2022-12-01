import { Logger } from 'lib/log';
import { parseFile } from 'lib/parser';

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

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    let max = 0;
    let acc = 0;

    this.lines.forEach((line) => {
      if (line === '') {
        max = Math.max(max, acc);
        acc = 0;
      } else {
        acc += +line;
      }
    });

    const result = max;
    logger.result(result);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    let acc = 0;
    let elvesCal = [];

    this.lines.forEach((line) => {
      if (line === '') {
        elvesCal.push(acc);
        acc = 0;
      } else {
        acc += +line;
      }
    });

    const result = elvesCal
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((sum, cur) => sum + cur, 0);
    logger.result(result);
  }
}

const year = '2022';
const day = '1';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
