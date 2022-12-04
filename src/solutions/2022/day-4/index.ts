import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

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
    let overlapCount = 0;
    this.lines.forEach((line) => {
      const { firstMin, firstMax, secondMin, secondMax } = parseLine(
        line,
        /(?<firstMin>.+)-(?<firstMax>.+),(?<secondMin>.+)-(?<secondMax>.+)/
      );

      if (
        (+firstMin >= +secondMin && +firstMax <= +secondMax) ||
        (+secondMin >= +firstMin && +secondMax <= +firstMax)
      )
        overlapCount++;
    });

    logger.result(overlapCount);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    let overlapCount = 0;
    this.lines.forEach((line) => {
      const { firstMin, firstMax, secondMin, secondMax } = parseLine(
        line,
        /(?<firstMin>.+)-(?<firstMax>.+),(?<secondMin>.+)-(?<secondMax>.+)/
      );

      if (
        (+firstMin <= +secondMin && +firstMax >= +secondMin) ||
        (+secondMin <= +firstMin && +secondMax >= +firstMin)
      )
        overlapCount++;
    });

    logger.result(overlapCount);
  }
}

const year = '2022';
const day = '4';
const testing = false;

const resolver = new Resolver({ year, day, testing });
//resolver.solve1();
resolver.solve2();
