import {
  bfs,
  Coordinates,
  getCellValue,
  neighborFilteringCondition,
} from 'lib/helper';
import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

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
        if (cell === 'S') this.start = [x, y];
        if (cell === 'E') this.end = [x, y];
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

    const ascendAtMostOne: neighborFilteringCondition = (
      current: Coordinates,
      neighbor: Coordinates
    ) =>
      getCellValue<number>(this.searchMap, neighbor) <=
      getCellValue<number>(this.searchMap, current) + 1;

    const bfsResult = bfs(this.searchMap, this.start, this.end, {
      enabled: true,
      condition: ascendAtMostOne,
    });
    logger.result(bfsResult.endNode.weight);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    const descendAtMostOne: neighborFilteringCondition = (
      current: Coordinates,
      neighbor: Coordinates
    ) =>
      getCellValue(this.searchMap, neighbor) >=
      getCellValue(this.searchMap, current) - 1;

    const bfsResult = bfs(
      this.searchMap,
      this.start,
      this.end,
      {
        enabled: true,
        condition: descendAtMostOne,
      },
      { enabled: true, searchedWeight: 0 }
    );

    logger.result(bfsResult.endNode.weight);
  }
}

const year = '2022';
const day = '12';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
