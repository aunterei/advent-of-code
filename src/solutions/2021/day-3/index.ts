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

    let gammaBits: number[] = [];

    for (let i = 0; i < this.lines[0].length; i++) {
      let count0 = 0;
      let count1 = 0;
      for (let j = 0; j < this.lines.length; j++) {
        if (this.lines[j][i] === '0') {
          count0++;
        } else {
          count1++;
        }
      }

      gammaBits[i] = count0 > count1 ? 0 : 1;
    }

    const gamma = parseInt(gammaBits.join(''), 2);
    const epsilon = parseInt(gammaBits.map((b) => 1 - b).join(''), 2);
    logger.result(gamma * epsilon);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    const oxygenGeneratorRating = calculateRating(this.lines, true);
    const co2ScrubberRating = calculateRating(this.lines, false);
    logger.result(oxygenGeneratorRating * co2ScrubberRating);
  }
}

function calculateRating(input: string[], isOxygenGeneratorRating: boolean) {
  for (let i = 0; i < input[0].length && input.length > 1; i++) {
    let count0 = 0;
    let count1 = 0;

    for (let j = 0; j < input.length; j++) {
      if (input[j][i] === '0') {
        count0++;
      } else {
        count1++;
      }
    }

    let criteria: number;
    if (isOxygenGeneratorRating) {
      criteria = count0 > count1 ? 0 : 1;
    } else {
      criteria = count0 > count1 ? 1 : 0;
    }

    input = input.filter((x) => x[i] === criteria.toString());
  }

  return parseInt(input[0], 2);
}
const year = '2021';
const day = '3';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
resolver.solve2();
