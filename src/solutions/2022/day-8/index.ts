import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];
  map: number[][] = [[]];
  mapWidth: number;
  mapHeight: number;

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

    this.lines.forEach((line, y) => {
      const trees = line.split('');
      trees.forEach((tree, x) => {
        this.map[y] ? this.map[y].push(+tree) : (this.map[y] = [+tree]);
      });
    });

    this.mapWidth = this.map[0].length;
    this.mapHeight = this.map.length;
  }

  private arrayColumn = (arr, n) => arr.map((x) => x[n]);
  // 287040
  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    const outsideTrees = 2 * this.lines[0].length + 2 * (this.lines.length - 2);

    let insideTreesVisible = 0;

    for (let y = 1; y < this.mapHeight - 1; y++) {
      for (let x = 1; x < this.mapWidth - 1; x++) {
        insideTreesVisible += this.isTreeVisible(x, y) ? 1 : 0;
      }
    }

    const result = outsideTrees + insideTreesVisible;
    logger.result(result);
  }

  private isTreeVisible(x: number, y: number): boolean {
    const treeHeight = this.map[y][x];

    //Look left
    if (treeHeight > Math.max(...this.map[y].slice(0, x))) {
      return true;
    }

    //Look Right
    if (treeHeight > Math.max(...this.map[y].slice(x + 1, this.mapWidth))) {
      return true;
    }

    const column = this.arrayColumn(this.map, x);
    //Look up
    if (treeHeight > Math.max(...column.slice(0, y))) {
      return true;
    }

    //Look down
    if (treeHeight > Math.max(...column.slice(y + 1, this.mapHeight))) {
      return true;
    }
    return false;
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    let scenicScore = 0;
    for (let y = 1; y < this.mapHeight - 1; y++) {
      for (let x = 1; x < this.mapWidth - 1; x++) {
        scenicScore = Math.max(scenicScore, this.getScenicScore(x, y));
      }
    }
    logger.result(scenicScore);
  }

  private getScenicScore(x: number, y: number): number {
    const treeHeight = this.map[y][x];

    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;

    //Look left
    for (let i = x - 1; i >= 0; i--) {
      left++;
      if (this.map[y][i] >= treeHeight) {
        break;
      }
    }

    //Look Right
    for (let i = x + 1; i < this.mapWidth; i++) {
      right++;
      if (this.map[y][i] >= treeHeight) {
        break;
      }
    }

    //Look up
    for (let i = y - 1; i >= 0; i--) {
      top++;
      if (this.map[i][x] >= treeHeight) {
        break;
      }
    }

    //Look down
    for (let i = y + 1; i < this.mapHeight; i++) {
      bottom++;
      if (this.map[i][x] >= treeHeight) {
        break;
      }
    }
    return left * right * top * bottom;
  }
}

const year = '2022';
const day = '8';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
resolver.solve2();
