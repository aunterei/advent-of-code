import { AdvancedSet } from 'lib/advanced-set';
import { Coordinates } from 'lib/helper';
import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Rock {
  coordinates: Coordinates[];
  height: number;
  constructor(
    startCoordinates: Coordinates[],
    height: number,
    highestPoint: number
  ) {
    this.coordinates = startCoordinates.map(
      (c) => new Coordinates(c.x, c.y + highestPoint)
    );
    this.height = height;
  }
}

const ROCKS: Rock[] = [
  /* @@@@*/
  new Rock(
    [
      new Coordinates(3, 4),
      new Coordinates(4, 4),
      new Coordinates(5, 4),
      new Coordinates(6, 4),
    ],
    1,
    0
  ),
  /* .@. 
     @@@
     .@.
  */
  new Rock(
    [
      new Coordinates(4, 6),
      new Coordinates(3, 5),
      new Coordinates(4, 5),
      new Coordinates(5, 5),
      new Coordinates(4, 4),
    ],
    3,
    0
  ),
  /* ..@
     ..@
     @@@
  */
  new Rock(
    [
      new Coordinates(5, 6),
      new Coordinates(5, 5),
      new Coordinates(3, 4),
      new Coordinates(4, 4),
      new Coordinates(5, 4),
    ],
    3,
    0
  ),
  /* @
     @
     @ 
     @*/
  new Rock(
    [
      new Coordinates(3, 7),
      new Coordinates(3, 6),
      new Coordinates(3, 5),
      new Coordinates(3, 4),
    ],
    4,
    0
  ),
  /* @@
     @@
  */
  new Rock(
    [
      new Coordinates(3, 5),
      new Coordinates(4, 5),
      new Coordinates(3, 4),
      new Coordinates(4, 4),
    ],
    2,
    0
  ),
];

class Tetris {
  fixedPositions = new AdvancedSet<Coordinates>(
    null,
    (value: Coordinates) => `[${value.x},${value.y}]`
  );

  patternFound = false;
  print: boolean;
  maxRockFixed: number;

  pattern: string;

  maxHeight: number = 0;
  rocksFixed: Rock[] = [];

  increaseHistory: number[] = [];

  patternIndex: number = 0;
  rockIndex: number = 0;
  visited = new Map<number, number[]>();
  currentRock: Rock;

  constructor(pattern: string, maxRockFixed: number, print: boolean) {
    this.pattern = pattern;
    this.maxRockFixed = maxRockFixed;

    this.print = print;

    this.fixedPositions.addRange([
      new Coordinates(1, 0),
      new Coordinates(2, 0),
      new Coordinates(3, 0),
      new Coordinates(4, 0),
      new Coordinates(5, 0),
      new Coordinates(6, 0),
      new Coordinates(7, 0),
    ]);
  }

  playGame(): number {
    while (this.maxRockFixed > this.rocksFixed.length && !this.patternFound) {
      const result = this.playTurn();
    }

    return this.maxHeight;
  }

  playTurn(): number {
    //If no rock Falling, getting next
    if (!this.currentRock) {
      const nextRock = ROCKS[this.rockIndex];
      this.currentRock = new Rock(
        nextRock.coordinates,
        nextRock.height,
        this.maxHeight
      );
      this.rockIndex = (this.rockIndex + 1) % ROCKS.length;
    }

    //Move according to Pattern if possible
    const patternMove = this.pattern[this.patternIndex];
    this.tryPatternMove(patternMove);

    this.patternIndex = (this.patternIndex + 1) % this.pattern.length;
    //Move Down if Possible
    const result = this.tryDownMove();

    return result;
  }

  tryPatternMove(pattern: string) {
    let move = new Coordinates(0, 0);

    move.x = pattern === '<' ? move.x - 1 : move.x + 1;

    const collisionCheck = this.checkCollision(move);

    if (collisionCheck.possible) {
      this.currentRock.coordinates = collisionCheck.newPos;
      if (this.print) this.printMap();
    }
  }
  tryDownMove() {
    const move = new Coordinates(0, -1);

    const collisionCheck = this.checkCollision(move);

    if (collisionCheck.possible) {
      this.currentRock.coordinates = collisionCheck.newPos;
      if (this.print) this.printMap();
    } else {
      this.rocksFixed.push(this.currentRock);
      this.fixedPositions.addRange(this.currentRock.coordinates);

      //Highest pos in rock is the first coordinate
      const max = Math.max(this.currentRock.coordinates[0].y, this.maxHeight);

      const increase = max - this.maxHeight;

      this.maxHeight += increase;
      this.currentRock = null;

      //Now Trying to find a pattern in the height increase
      this.increaseHistory.push(increase);
      const hashId =
        this.patternIndex * this.patternIndex + this.rockIndex * ROCKS.length;
      const turns = this.maxRockFixed - this.rocksFixed.length;

      if (this.visited.has(hashId)) {
        const pastVisits = this.visited.get(hashId);
        pastVisits.push(this.increaseHistory.length - 1);
        const cycleLength = this.findPattern(pastVisits, this.increaseHistory);
        if (cycleLength) {
          const q = Math.floor(turns / cycleLength);
          const r = turns % cycleLength;
          console.log(
            this.maxHeight +
              q *
                this.increaseHistory
                  .slice(-cycleLength)
                  .reduce((sum, v) => sum + v, 0) +
              this.increaseHistory
                .slice(-cycleLength, -cycleLength + r)
                .reduce((sum, v) => sum + v, 0)
          );
          this.patternFound = true;
          this.maxHeight +=
            q *
              this.increaseHistory
                .slice(-cycleLength)
                .reduce((sum, v) => sum + v, 0) +
            this.increaseHistory
              .slice(-cycleLength, -cycleLength + r)
              .reduce((sum, v) => sum + v, 0);
          return;
        }
      } else {
        this.visited.set(hashId, [this.increaseHistory.length - 1]);
      }
    }
    return -1;
  }
  findPattern(pastVisits: number[], increaseHistory: number[]) {
    const lastIndex = pastVisits[pastVisits.length - 1];
    for (let i = 0; i < pastVisits.length - 1; i++) {
      const testIndex = pastVisits[i];
      const cycleLength = lastIndex - testIndex;
      if (testIndex + 1 < cycleLength) continue;
      let j = 0;
      while (j < cycleLength) {
        if (increaseHistory[lastIndex - j] !== increaseHistory[testIndex - j])
          break;
        j++;
      }
      if (j === cycleLength) return cycleLength;
    }
    return 0;
  }

  checkCollision(movement: Coordinates): any {
    const newPos = this.currentRock.coordinates.map(
      (r) => new Coordinates(r.x + movement.x, r.y + movement.y)
    );

    //Check if hits game boundaries
    if (newPos.findIndex((c) => c.x === 8 || c.x === 0) !== -1) {
      return { possible: false, newPos: newPos };
    }

    //Check if hit other brick

    return {
      possible: !this.fixedPositions.hasOneOfRange(newPos),
      newPos: newPos,
    };
  }

  clean() {
    const current = this.getMinMaxY(this.currentRock.coordinates);

    const filtered = this.rocksFixed.filter((r) => {
      const fixed = this.getMinMaxY(r.coordinates);

      if (fixed.min >= current.min - 10) {
        return true;
      }
      return false;
    });
    this.rocksFixed = filtered;
  }

  getMinMaxY(coordinates: Coordinates[]): { min: number; max: number } {
    return coordinates.reduce(
      (acc, cur) => {
        return { min: Math.min(acc.min, cur.y), max: Math.max(acc.max, cur.y) };
      },
      { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
    );
  }
  printMap() {
    let map: string[][] = [];
    map.push(['+', '-', '-', '-', '-', '-', '-', '-', '+']);
    for (let i = 0; i < 24; i++) {
      map.push(['|', '.', '.', '.', '.', '.', '.', '.', '|']);
    }
    for (const coord of this.currentRock.coordinates) {
      map[coord.y][coord.x] = '@';
    }

    for (const fixedRock of this.rocksFixed) {
      for (const coord of fixedRock.coordinates) {
        map[coord.y][coord.x] = '#';
      }
    }

    const string = map
      .reverse()
      .reduce((acc, cur) => acc + cur.join('') + '\n', '');
    console.log(string);
  }
}

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
  }
  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    const game = new Tetris(this.file, 1000000000000, false);

    const result = game.playGame();

    logger.result(result);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    const result = 0;
    logger.result(result);
  }
}

const year = '2022';
const day = '17';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
// resolver.solve2()
