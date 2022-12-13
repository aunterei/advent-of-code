import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];
  packets: any[];

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
    this.packets = [];
    for (let i = 0; i < this.lines.length; i += 3) {
      const left = JSON.parse(this.lines[i]);
      const right = JSON.parse(this.lines[i + 1]);
      this.packets.push(left, right);
    }
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    let indicesSum = 0;
    let currentPacket = 0;

    for (let i = 0; i < this.packets.length; i += 2) {
      currentPacket++;
      const result = this.comparePacketPairs(
        this.packets[i],
        this.packets[i + 1]
      );
      if (result < 0) {
        indicesSum += currentPacket;
      }
    }
    logger.result(indicesSum);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    const divider1 = [[2]];
    const divider2 = [[6]];

    this.packets.push(divider1, divider2);
    this.packets.sort(this.comparePacketPairs);

    const index1 = this.packets.indexOf(divider1) + 1;
    const index2 = this.packets.indexOf(divider2) + 1;

    logger.result(index1 * index2);
  }

  private comparePacketPairs = (left: any, right: any): number => {
    //If both are numbers return difference, not in order if negative
    if (Number.isInteger(left) && Number.isInteger(right)) {
      return left - right;
    }
    //Else we box the right part in an array
    else if (Number.isInteger(left) && Array.isArray(right)) {
      left = [left];
    } else if (Array.isArray(left) && Number.isInteger(right)) {
      right = [right];
    }
    //And start comparing
    for (let i = 0; i < left.length; i++) {
      // Right side ran out of items, so inputs are not in the right order
      if (i >= right.length) {
        return 1;
      } else {
        const result = this.comparePacketPairs(left[i], right[i]);
        // Packets don't match, return the comparison result
        if (result !== 0) {
          return result;
        }
      }
    }
    //Packets are the same
    if (left.length === right.length) {
      return 0;
    }
    // Left side ran out of items, so inputs are in the right order
    else {
      return -1;
    }
  };
}

const year = '2022';
const day = '13';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
resolver.solve2();
