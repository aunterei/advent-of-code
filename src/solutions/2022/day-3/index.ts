import {
  commonElementInMultipleArrays,
  commonElementInTwoArrays,
} from 'lib/helper';
import { Logger } from 'lib/log';
import { parseFile } from 'lib/parser';
import { itemPriority } from './itemPriority.model';

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

  private rucksackToPriorityArray(rucksack: string): number[] {
    return rucksack.split('').map((c) => itemPriority[c]);
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    let sum = 0;
    this.lines.forEach((line) => {
      const half: number = Math.ceil(line.length / 2);

      const firstRucksack: number[] = this.rucksackToPriorityArray(
        line.slice(0, half)
      );
      const secondRucksack: number[] = this.rucksackToPriorityArray(
        line.slice(half)
      );

      sum += commonElementInTwoArrays(firstRucksack, secondRucksack);
    });

    logger.result(sum);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    let sum = 0;
    for (let i = 0; i < this.lines.length; i += 3) {
      if (
        i >= this.lines.length ||
        i + 1 >= this.lines.length ||
        i + 2 >= this.lines.length
      )
        break;
      const firstElf = this.rucksackToPriorityArray(this.lines[i]);
      const secondElf = this.rucksackToPriorityArray(this.lines[i + 1]);
      const thirdElf = this.rucksackToPriorityArray(this.lines[i + 2]);

      sum += commonElementInMultipleArrays([firstElf, secondElf, thirdElf]);
    }

    logger.result(sum);
  }
}
const year = '2022';
const day = '3';
const testing = false;

const resolver = new Resolver({ year, day, testing });
//resolver.solve1();
resolver.solve2();
