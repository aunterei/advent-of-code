import { Coordinates } from 'lib/helper';
import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

interface Sensor {
  pos: Coordinates;
  range: number;
  closestBeacon: Coordinates;
}
interface Interval {
  start: number;
  end: number;
}

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

  sensors: Sensor[];
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
    this.parseSensors();
  }

  private parseSensors(): void {
    this.sensors = [];
    this.lines.forEach((line) => {
      const { x, y, beaconX, beaconY } = parseLine(
        line,
        /Sensor at x=(?<x>.+), y=(?<y>.+): closest beacon is at x=(?<beaconX>.+), y=(?<beaconY>.+)/
      );

      this.sensors.push({
        pos: new Coordinates(+x, +y),
        range: Math.abs(+beaconY - +y) + Math.abs(+beaconX - +x),
        closestBeacon: new Coordinates(+beaconX, +beaconY),
      });
    });
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    const { minX, maxX, maxRange } = this.sensors.reduce(
      (acc, cur) => {
        acc.minX = Math.min(acc.minX, cur.pos.x, cur.closestBeacon.x);
        acc.maxX = Math.max(acc.maxX, cur.pos.x, cur.closestBeacon.x);
        acc.maxRange = Math.max(acc.maxRange, cur.range);
        return acc;
      },
      {
        minX: Number.MAX_SAFE_INTEGER,
        maxX: Number.MIN_SAFE_INTEGER,
        maxRange: Number.MIN_SAFE_INTEGER,
      }
    );

    const unavailablePositions = this.countUnavailablePosOnY(
      searchedY,
      minX - maxRange,
      maxX + maxRange
    );

    logger.result(unavailablePositions);
  }

  private countUnavailablePosOnY(
    y: number,
    minX: number,
    maxX: number
  ): number {
    let unavailablePositions = 0;
    for (let x = minX; x <= maxX; x++) {
      if (
        this.sensors.findIndex(
          (s) => s.closestBeacon.x === x && s.closestBeacon.y === y
        ) !== -1
      ) {
        continue;
      }

      if (
        this.sensors.findIndex(
          (s) => Math.abs(x - s.pos.x) + Math.abs(y - s.pos.y) <= s.range
        ) !== -1
      ) {
        unavailablePositions++;
      }
    }
    return unavailablePositions;
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    let searchedPos = new Coordinates(0, 0);

    for (let y = 0; y <= maxSpace; y++) {
      let skippingIntervals: Interval[] = [];

      for (const sensor of this.sensors) {
        let distFromY = Math.abs(sensor.pos.y - y);
        let interval = sensor.range - distFromY;

        //No intersecting elements
        if (interval < 0) continue;

        skippingIntervals.push({
          start: Math.max(sensor.pos.x - interval, 0),
          end: Math.min(sensor.pos.x + interval, maxSpace),
        });
      }

      let searchPos = 0;

      const iterate = (): boolean => {
        for (let interval of skippingIntervals) {
          if (interval.start <= searchPos && searchPos < interval.end) {
            searchPos = interval.end;
            return true;
          }
        }
        return false;
      };

      while (iterate()) {
        continue;
      }

      if (searchPos !== maxSpace) {
        searchedPos.x = searchPos + 1;
        searchedPos.y = y;
        break;
      }
    }

    logger.result(searchedPos.x * maxSpace + searchedPos.y);
  }
}

const year = '2022';
const day = '15';
const testing = false;
const searchedY = testing ? 10 : 2000000;
const maxSpace = testing ? 20 : 4000000;
const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
