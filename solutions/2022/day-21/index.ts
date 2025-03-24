import { debug } from 'console';
import { cp } from 'fs';
import { AdvancedSet } from 'lib/advanced-set';
import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

interface Monkey {
  id: string;
  leftMonkey?: string;
  rightMonkey?: string;
  leftValue?: number;
  rightValue?: number;
  operand?: string;
  value?: number;
}
class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];
  monkeys: AdvancedSet<Monkey> = new AdvancedSet<Monkey>(null, (m) => m.id);

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
    this.lines.forEach((line) => {
      const [id, valueOrLeft, op, right] = line.split(' ');
      if (!op && !right) {
        this.monkeys.add({
          id: id.slice(0, id.length - 1),
          value: +valueOrLeft,
        });
      } else {
        this.monkeys.add({
          id: id.slice(0, id.length - 1),
          leftMonkey: valueOrLeft,
          operand: op,
          rightMonkey: right,
        });
      }
    });
  }

  findRootValue(monkeys: AdvancedSet<Monkey>) {
    while (monkeys.get({ id: 'root' }).value === undefined) {
      monkeys.forEach((m: Monkey) => {
        if (m.value) return;

        if (monkeys.has({ id: m.leftMonkey }))
          m.leftValue = monkeys.get({ id: m.leftMonkey }).value;

        if (monkeys.has({ id: m.rightMonkey }))
          m.rightValue = monkeys.get({ id: m.rightMonkey }).value;

        if (m.leftValue && m.rightValue) {
          switch (m.operand) {
            case '+':
              m.value = m.leftValue + m.rightValue;
              break;
            case '-':
              m.value = m.leftValue - m.rightValue;
              break;
            case '*':
              m.value = m.leftValue * m.rightValue;
              break;
            case '/':
              m.value = m.leftValue / m.rightValue;
              break;
            case '===':
              m.value = Number(m.leftValue === m.rightValue);
              break;
          }
        }
      });
    }

    return monkeys.get({ id: 'root' }).value;
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    logger.result(this.findRootValue(this.monkeys));
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    this.monkeys.get({ id: 'root' }).operand = '===';

    let intervalMin = 0;
    let intervalMax = 10000000000000;

    //Try guesses by dichotomy
    while (1) {
      var clonedSet = new AdvancedSet<Monkey>(
        [...JSON.parse(JSON.stringify([...this.monkeys]))],
        (m: Monkey) => m.id
      );

      const newIntervalLimit = Math.floor((intervalMin + intervalMax) / 2);
      clonedSet.get({ id: 'humn' }).value = newIntervalLimit;

      const rootValue = this.findRootValue(clonedSet);
      if (rootValue === 1) {
        logger.result(clonedSet.get({ id: 'humn' }).value);
        break;
      } else {
        const rootMonkey = clonedSet.get({ id: 'root' });
        if (rootMonkey.leftValue > rootMonkey.rightValue) {
          //To avoid infinite loop
          if (intervalMin === newIntervalLimit) break;
          intervalMin = newIntervalLimit;
        } else {
          if (intervalMax === newIntervalLimit) break;
          intervalMax = newIntervalLimit;
        }
      }
    }
  }
}

const year = '2022';
const day = '21';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
