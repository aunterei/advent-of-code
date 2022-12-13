import {
  areCoordinatesEqual,
  bfs,
  Coordinates,
  getCartesianNeighbors,
} from 'lib/helper';
import { Logger } from 'lib/log';
import { parseFile } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string;
  searchMap: number[][];
  start: Coordinates;
  end: Coordinates;

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

    this.searchMap = this.file.split('\n').map((row, y) =>
      row.split('').map((cell, x) => {
        if (cell === 'S') this.start = { x: x, y: y };
        if (cell === 'E') this.end = { x: x, y: y };
        return this.getCellHeight(cell);
      })
    );
  }

  private getCellHeight(cell: string): number {
    if (cell === 'S') return 0;
    if (cell === 'E') return 25;
    return 'abcdefghijklmnopqrstuvwxyz'.indexOf(cell);
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    const bfsResult = bfs(
      this.start,
      (c) => areCoordinatesEqual(c, this.end),
      (c) =>
        getCartesianNeighbors(c, this.searchMap).filter(
          (neighbor) =>
            this.searchMap[neighbor.y][neighbor.x] - this.searchMap[c.y][c.x] <=
            1
        )
    );
    logger.result(bfsResult.endNode.weight);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    const bfsResult = bfs(
      this.end,
      (c) => this.searchMap[c.y][c.x] === 0,
      (c) =>
        getCartesianNeighbors(c, this.searchMap).filter(
          (neighbor) =>
            this.searchMap[neighbor.y][neighbor.x] >=
            this.searchMap[c.y][c.x] - 1
        )
    );
    logger.result(bfsResult.endNode.weight);
  }
}

const year = '2022';
const day = '12';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
resolver.solve2();
