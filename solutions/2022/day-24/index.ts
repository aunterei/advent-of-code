import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

type State = [row: number, column: number, minutes: number];
type Position = [row: number, column: number];
type Visited = Array<Array<Array<boolean>>>;

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

  rows: number;
  columns: number;
  start: Position;
  end: Position;
  winds: string[];
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
    this.rows = this.lines.length - 2;
    this.columns = this.lines[0].length - 2;
    this.start = [0, 1];
    this.end = [this.rows + 1, this.columns];
    this.winds = this.lines
      .slice(1, -1)
      .map((line) => line.substring(1, line.length - 1));
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    logger.result(this.travelTime(this.start, this.end, 0));
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    const firstTime = this.travelTime(this.start, this.end, 0);
    const backForSnacks = this.travelTime(this.end, this.start, firstTime);
    const secondTime = this.travelTime(this.start, this.end, backForSnacks);
    logger.result(secondTime);
  }

  mod(n: number, d: number): number {
    return ((n % d) + d) % d;
  }

  hasWind(row: number, column: number, minutes: number): boolean {
    row -= 1;
    column -= 1;
    return (
      this.winds[this.mod(row - minutes, this.rows)][column] === 'v' ||
      this.winds[this.mod(row + minutes, this.rows)][column] === '^' ||
      this.winds[row][this.mod(column - minutes, this.columns)] === '>' ||
      this.winds[row][this.mod(column + minutes, this.columns)] === '<'
    );
  }
  canMove(
    row: number,
    column: number,
    minutes: number,
    visited: Visited
  ): boolean {
    if (
      (row === this.start[0] && column === this.start[1]) ||
      (row === this.end[0] && column === this.end[1])
    )
      return true; // starting positions
    if (
      row < 0 ||
      row > this.rows ||
      row === 0 ||
      row === this.rows + 1 ||
      column === 0 ||
      column === this.columns + 1
    )
      return false; // boundary
    return (
      !this.hasWind(row, column, minutes) &&
      !visited[row][column][minutes % (this.rows * this.columns)]
    );
  }

  travelTime(from: Position, to: Position, initialMinutes: number): number {
    const visited: Visited = new Array(this.rows + 2)
      .fill(undefined)
      .map(() =>
        new Array(this.columns + 2)
          .fill(undefined)
          .map(() => new Array(this.rows * this.columns).fill(false))
      );
    const stack: Array<State> = [[from[0], from[1], initialMinutes]];
    while (stack.length > 0) {
      const [row, column, minutes] = stack.shift()!;
      if (row === to[0] && column === to[1]) {
        return minutes;
      }

      const next: Array<State> = [];
      if (this.canMove(row, column, minutes + 1, visited))
        next.push([row, column, minutes + 1]);
      if (this.canMove(row + 1, column, minutes + 1, visited))
        next.push([row + 1, column, minutes + 1]);
      if (this.canMove(row - 1, column, minutes + 1, visited))
        next.push([row - 1, column, minutes + 1]);
      if (this.canMove(row, column + 1, minutes + 1, visited))
        next.push([row, column + 1, minutes + 1]);
      if (this.canMove(row, column - 1, minutes + 1, visited))
        next.push([row, column - 1, minutes + 1]);

      for (const nextState of next) {
        stack.push(nextState);
        visited[nextState[0]][nextState[1]][
          nextState[2] % (this.rows * this.columns)
        ] = true;
      }
    }
    return -1;
  }
}

const year = '2022';
const day = '24';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
