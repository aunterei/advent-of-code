import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string[];
  lines: string[];

  drawing: string[];
  procedure: string[];

  stacks: string[][] = [];

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
    this.file = parseFile(year, day, testing ? 'test' : 'data').split('\n\n');

    this.drawing = this.file[0].split('\n');
    this.procedure = this.file[1].split('\n');

    for (let i = 0; i < this.drawing.length - 1; i++) {
      const drawingLine = this.drawing[i];

      for (let j = 0; j < drawingLine.length; j += 4) {
        const stackIndex = j / 4;
        if (!this.stacks[stackIndex]) this.stacks[stackIndex] = [];
        if (drawingLine[j + 1] !== ' ')
          this.stacks[stackIndex].push(drawingLine[j + 1]);
      }
    }
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    this.procedure.forEach((line) => {
      const { quantity, from, to } = parseLine(
        line,
        /move (?<quantity>.+) from (?<from>.+) to (?<to>.+)/
      );

      for (let i = 0; i < quantity; i++) {
        const movedBox = this.stacks[+from - 1].splice(0, 1);
        this.stacks[+to - 1] = [...movedBox, ...this.stacks[+to - 1]];
      }
    });

    const result = this.stacks.reduce((acc, cur) => {
      return acc + cur[0];
    }, '');

    logger.result(result);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    this.procedure.forEach((line) => {
      const { quantity, from, to } = parseLine(
        line,
        /move (?<quantity>.+) from (?<from>.+) to (?<to>.+)/
      );

      const movedBox = this.stacks[+from - 1].splice(0, quantity);
      this.stacks[+to - 1] = [...movedBox, ...this.stacks[+to - 1]];
    });

    const result = this.stacks.reduce((acc, cur) => {
      return acc + cur[0];
    }, '');

    logger.result(result);
  }
}

const year = '2022';
const day = '5';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
// resolver.solve2();
