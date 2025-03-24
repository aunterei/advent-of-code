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

  private findFirstMarker(dataStream: string, markerSize: number): number {
    let result = 0;

    for (let i = 0; i + markerSize - 1 < dataStream.length; i += 1) {
      const slice = this.file.slice(i, i + markerSize).split('');

      if (new Set(slice).size === markerSize) {
        result = i + markerSize;
        break;
      }
    }

    return result;
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    logger.result(this.findFirstMarker(this.file, 4));
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    logger.result(this.findFirstMarker(this.file, 14));
  }
}

const year = '2022';
const day = '6';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
//resolver.solve2();
