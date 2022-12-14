import { Coordinates } from 'lib/helper';
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
    const { x, aim } = this.parseInstructions();
    logger.result(x * aim);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    const { x, y } = this.parseInstructions();
    logger.result(x * y);
  }

  private parseInstructions() {
    const coordinates = new Coordinates(0, 0);
    let aim = 0;

    this.lines.forEach((line) => {
      const { command, value } = parseLine(line, /(?<command>.+) (?<value>.+)/);

      switch (command) {
        case 'forward':
          coordinates.x += +value;
          coordinates.y += aim * value;
          break;
        case 'down':
          aim += +value;
          break;
        case 'up':
          aim -= +value;
          break;
      }
    });
    return { x: coordinates.x, y: coordinates.y, aim: aim };
  }
}

const year = '2021';
const day = '2';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
resolver.solve2();
