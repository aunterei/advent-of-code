import { Coordinates, CoordinatesSet } from 'lib/helper';
import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

  rockCoordinates = new CoordinatesSet();
  sandCoordinates = new CoordinatesSet();

  map: string[][];

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
    this.parseMap();
    this.buildBaseMap();
  }

  async solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    this.processSandFall(false, false);
    logger.result(this.sandCoordinates.size);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    this.processSandFall(true, false);
    logger.result(this.sandCoordinates.size);
  }

  private parseMap(): void {
    for (const line of this.lines) {
      const coordinates = line.split(' -> ');

      for (let i = 0; i < coordinates.length - 1; i++) {
        const [x1, y1] = coordinates[i].split(',').map(Number);
        const [x2, y2] = coordinates[i + 1].split(',').map(Number);

        if (x1 == x2) {
          const minY = Math.min(y1, y2);
          const maxY = Math.max(y1, y2);
          for (let y = minY; y <= maxY; y++) {
            this.rockCoordinates.push(x1, y);
          }
        } else {
          const minX = Math.min(x1, x2);
          const maxX = Math.max(x1, x2);
          for (let x = minX; x <= maxX; x++) {
            this.rockCoordinates.push(x, y1);
          }
        }
      }
    }
  }

  private async processSandFall(
    hasFloor: boolean = false,
    print: boolean = false
  ) {
    let processRunning = true;
    let maxY = 0;
    this.rockCoordinates.forEach((c) => (maxY = Math.max(maxY, c.y)));

    while (processRunning) {
      let sand = new Coordinates(500, 0);

      // move sand
      while (processRunning) {
        if (!hasFloor && sand.y > maxY) {
          processRunning = false;
          continue;
        }

        if (!hasFloor || (hasFloor && sand.y < maxY + 1)) {
          if (
            !this.rockCoordinates.hadCoordinates(sand.x, sand.y + 1) &&
            !this.sandCoordinates.hadCoordinates(sand.x, sand.y + 1)
          ) {
            sand.y++;

            if (print) await this.printSand(sand, false);
            continue;
          } else if (
            !this.rockCoordinates.hadCoordinates(sand.x - 1, sand.y + 1) &&
            !this.sandCoordinates.hadCoordinates(sand.x - 1, sand.y + 1)
          ) {
            sand.x--;
            sand.y++;
            if (print) await this.printSand(sand, false);
            continue;
          } else if (
            !this.rockCoordinates.hadCoordinates(sand.x + 1, sand.y + 1) &&
            !this.sandCoordinates.hadCoordinates(sand.x + 1, sand.y + 1)
          ) {
            sand.x++;
            sand.y++;
            if (print) await this.printSand(sand, false);
            continue;
          }
        }
        this.sandCoordinates.push(sand.x, sand.y);
        if (print) await this.printSand(sand, true);
        break;
      }
      if (hasFloor && sand.x === 500 && sand.y === 0) {
        processRunning = false;
      }
    }
  }

  private buildBaseMap(): void {
    this.map = [];
    const rockArr = Array.from(this.rockCoordinates);

    const maxY = rockArr.reduce((acc, cur) => {
      return Math.max(acc, cur.y);
    }, 0);
    const minX = rockArr.reduce((acc, cur) => {
      return Math.min(acc, cur.x);
    }, Number.MAX_SAFE_INTEGER);
    const maxX = rockArr.reduce((acc, cur) => {
      return Math.max(acc, cur.x);
    }, 0);

    for (let y = 0; y < maxY + 2; y++) {
      this.map.push([]);

      for (let x = minX - 2; x < maxX + 2; x++) {
        this.map[y][x] = this.rockCoordinates.hadCoordinates(x, y) ? '#' : '.';
      }
    }
  }

  private async printSand(coord: Coordinates, fixed: boolean): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const mapCopy = this.map.map((arr) => arr.slice());
    mapCopy[coord.y][coord.x] = 'o';

    let mapString = '';

    for (let y = 0; y < mapCopy.length; y++) {
      mapString += mapCopy[y].join('') + '\n';
    }

    console.log(mapString);

    if (fixed) {
      this.map = mapCopy.map((arr) => arr.slice());
    }
  }
}

const year = '2022';
const day = '14';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
