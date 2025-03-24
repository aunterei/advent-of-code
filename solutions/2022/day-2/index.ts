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

  private baseScore = {
    X: 1,
    Y: 2,
    Z: 3,
  };

  private opponentLoose = {
    A: 'Y',
    B: 'Z',
    C: 'X',
  };

  private draw = {
    A: 'X',
    B: 'Y',
    C: 'Z',
  };

  private opponentWin = {
    A: 'Z',
    B: 'X',
    C: 'Y',
  };

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    let score = 0;
    this.lines.forEach((line) => {
      const { opponent, me } = parseLine(line, /(?<opponent>.+) (?<me>.+)/);

      score += this.baseScore[me];

      if (this.opponentLoose[opponent] === me) score += 6;
      else if (this.draw[opponent] === me) score += 3;
    });

    logger.result(score);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    let score = 0;
    this.lines.forEach((line) => {
      const { opponent, outcome } = parseLine(
        line,
        /(?<opponent>.+) (?<outcome>.+)/
      );

      if (outcome === 'X') {
        score += this.baseScore[this.opponentWin[opponent]];
      } else if (outcome === 'Y') {
        score += 3 + this.baseScore[this.draw[opponent]];
      } else {
        score += 6 + this.baseScore[this.opponentLoose[opponent]];
      }
    });

    logger.result(score);
  }
}

const year = '2022';
const day = '2';
const testing = false;

const resolver = new Resolver({ year, day, testing });
//resolver.solve1();
resolver.solve2();
