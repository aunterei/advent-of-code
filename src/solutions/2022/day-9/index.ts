import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

interface Position {
  x: number;
  y: number;
}

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];
  visitedByTailPositions: Position[] = [{ x: 0, y: 0 }];

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

    this.runCordSimulation(2);
    logger.result(this.visitedByTailPositions.length);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    this.runCordSimulation(10);
    logger.result(this.visitedByTailPositions.length);
  }

  private runCordSimulation(numberOfKnots: number) {
    let knotsPosition: Position[] = [];

    for (let i = 0; i < numberOfKnots; i++) {
      knotsPosition.push({ x: 0, y: 0 });
    }

    this.lines.forEach((line) => {
      const { direction, steps } = parseLine(
        line,
        /(?<direction>.+) (?<steps>.+)/
      );

      for (let i = 0; i < +steps; i++) {
        //Move Head
        this.moveRopeKnot(knotsPosition[0], direction);

        for (let j = 1; j < knotsPosition.length; j++) {
          const previousKnot = knotsPosition[j - 1];
          const currentKnot = knotsPosition[j];
          if (
            Math.abs(previousKnot.x - currentKnot.x) <= 1 &&
            Math.abs(previousKnot.y - currentKnot.y) <= 1
          ) {
            continue;
          }

          const yDistance = previousKnot.y - currentKnot.y;
          const xDistance = previousKnot.x - currentKnot.x;

          if (previousKnot.x === currentKnot.x) {
            this.moveRopeKnot(currentKnot, yDistance > 0 ? 'U' : 'D');
          } else if (previousKnot.y === currentKnot.y) {
            this.moveRopeKnot(currentKnot, xDistance > 0 ? 'R' : 'L');
          } else {
            this.moveRopeKnot(currentKnot, xDistance > 0 ? 'R' : 'L');
            this.moveRopeKnot(currentKnot, yDistance > 0 ? 'U' : 'D');
          }
        }

        this.addIfNotVisited(knotsPosition[knotsPosition.length - 1]);
      }
    });

    return;
  }

  private moveRopeKnot(currentPosition: Position, direction: string) {
    switch (direction) {
      case 'U':
        currentPosition.y++;
        break;

      case 'D':
        currentPosition.y--;
        break;

      case 'R':
        currentPosition.x++;
        break;

      case 'L':
        currentPosition.x--;
        break;
    }
  }

  private addIfNotVisited(pos: Position): void {
    if (
      !this.visitedByTailPositions.find((p) => p.x === pos.x && p.y === pos.y)
    )
      this.visitedByTailPositions.push({ x: pos.x, y: pos.y });
  }
}

const year = '2022';
const day = '9';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
//resolver.solve2();
