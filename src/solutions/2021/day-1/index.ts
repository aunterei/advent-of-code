import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string;
  depths: number[];

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
    this.depths = this.file.split('\n').map((s) => +s);
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    let increased = 0;

    for (let i = 1; i < this.depths.length; i++) {
      if (this.depths[i - 1] < this.depths[i]) increased++;
    }
    logger.result(increased);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    let windows = [];
    let increased = 0;

    for (let i = 0; i < this.depths.length - 2; i++) {
      windows.push(
        this.depths.slice(i, i + 3).reduce((cur, acc) => acc + cur, 0)
      );
    }

    for (let i = 1; i < windows.length; i++) {
      if (windows[i - 1] < windows[i]) increased++;
    }

    logger.info(windows);
    logger.result(increased);
  }
}

const year = '2021';
const day = '1';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
