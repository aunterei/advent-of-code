import { Dijkstra } from 'lib/dijkstra';

import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];
  map: number[][];
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

  private createMap(replicationCount: number): void {
    this.map = [];

    let intInput = this.file
      .split('\n')
      .map((line) => line.split('').map((v) => parseInt(v, 10)));

    let height = intInput.length;
    let width = intInput[0].length;

    for (let y = 0; y < height * replicationCount; ++y) {
      this.map.push([]);
      for (let x = 0; x < width * replicationCount; ++x) {
        let addValue = Math.floor(x / width) + Math.floor(y / height);

        this.map[y].push(
          ((intInput[y % height][x % width] + addValue - 1) % 9) + 1
        );
      }
    }
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    this.createMap(1);

    const dijkstra = new Dijkstra();
    dijkstra.parseMap(this.map);
    const val = dijkstra.getEndPointCostFromStart({
      x: this.map[0].length - 1,
      y: this.map.length - 1,
    });

    logger.result(val);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    this.createMap(5);

    const dijkstra = new Dijkstra();
    dijkstra.parseMap(this.map);
    const val = dijkstra.getEndPointCostFromStart({
      x: this.map[0].length - 1,
      y: this.map.length - 1,
    });

    logger.result(val);
  }
}

const year = '2021';
const day = '15';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
resolver.solve2();
