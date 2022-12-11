import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';
import { Game } from './game';

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];
  game: Game;

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
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    this.game = new Game(this.file, true, false);
    this.game.playNTurns(20);
    this.game.printMonkeyInspections();
    logger.result('');
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    this.game = new Game(this.file, false, true);
    this.game.playNTurns(10000);
    this.game.printMonkeyInspections();
    logger.result('');
  }
}

const year = '2022';
const day = '11';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
