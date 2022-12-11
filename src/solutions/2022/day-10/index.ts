import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];
  frequencies: number[] = [20, 60, 100, 140, 180, 220];
  signalsStrength: number[] = [];
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
    let cycle = 0;
    let register = 1;

    this.lines.forEach((line) => {
      cycle++;
      this.addIfRightFrequency(cycle, register);

      const cmd = line.split(' ');

      if (cmd[0] === 'addx') {
        cycle++;
        this.addIfRightFrequency(cycle, register);
        register += +cmd[1];
      }
    });

    const result = this.signalsStrength.reduce((cur, acc) => cur + acc, 0);
    logger.result(result);
  }

  private addIfRightFrequency(cycle: number, register: number): void {
    if (this.frequencies.includes(cycle)) {
      this.signalsStrength.push(register * cycle);
    }
  }

  private w = 40;
  private h = 6;
  private pixel = '#';
  private noPixel = '.';
  private screen: Array<Array<string | null>> = Array.from(
    { length: this.h },
    () => Array.from({ length: this.w }, () => null)
  );

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    let cycle = 0;
    let spritePosition = 1;

    this.lines.forEach((line) => {
      this.drawOnScreen(cycle, spritePosition);
      cycle++;

      const cmd = line.split(' ');

      if (cmd[0] === 'addx') {
        this.drawOnScreen(cycle, spritePosition);
        cycle++;
        spritePosition += +cmd[1];
      }
    });

    this.screen.forEach((line) => {
      console.log(line.map((i) => i).join(''));
    });
    logger.result(0);
  }

  private drawOnScreen(cycle: number, spritePosition: number) {
    const col = cycle % this.w;
    const row = Math.floor(cycle / this.w);

    const char =
      col >= spritePosition - 1 && col <= spritePosition + 1
        ? this.pixel
        : this.noPixel;

    this.screen[row][col] = char;
  }
}

const year = '2022';
const day = '10';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
