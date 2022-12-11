import { parseLine } from 'lib/parser';
import { Monkey } from './monkey.class';

export class Game {
  monkeys: Monkey[];
  roundNumber: number;
  commonDenominator: number;

  constructor(input: string, reliefMode: boolean, manageWorryLevels: boolean) {
    this.monkeys = [];
    this.roundNumber = 0;
    this.parseInput(input, reliefMode, manageWorryLevels);
  }

  private parseInput(
    input: string,
    reliefMode: boolean,
    manageWorryLevels: boolean
  ): void {
    const monkeysInput: string[] = input.split('\n\n');

    for (let monkeyInput of monkeysInput) {
      const monkeyInfos: string[] = monkeyInput.split('\n');

      const startingItems: number[] = parseLine(
        monkeyInfos[1],
        /Starting items: (?<values>.+)/
      )
        ['values'].split(',')
        .map((itemStr) => +itemStr.trim());

      const { operator, factor } = parseLine(
        monkeyInfos[2],
        /Operation: new = old (?<operator>.+) (?<factor>.+)/
      );

      const { testDivision } = parseLine(
        monkeyInfos[3],
        /Test: divisible by (?<testDivision>.+)/
      );
      const { ifTrueThrowTo } = parseLine(
        monkeyInfos[4],
        /If true: throw to monkey (?<ifTrueThrowTo>.+)/
      );
      const { ifFalseThrowTo } = parseLine(
        monkeyInfos[5],
        /If false: throw to monkey (?<ifFalseThrowTo>.+)/
      );

      const monkey = new Monkey(
        startingItems,
        operator,
        factor,
        +testDivision,
        +ifTrueThrowTo,
        +ifFalseThrowTo,
        reliefMode,
        manageWorryLevels
      );
      this.monkeys.push(monkey);
    }

    this.commonDenominator = this.monkeys
      .map((monkey) => monkey.testDivision)
      .reduce((a, b) => a * b);
  }

  public playNTurns(numberOfTurns: number): void {
    for (let i = 0; i < numberOfTurns; i++) {
      this.playTurn();
    }
  }

  private playTurn(): void {
    for (let monkey of this.monkeys) {
      const throwedItems = monkey.doMonkeyTurn(this.commonDenominator);

      for (let item of throwedItems) {
        this.monkeys[item.throwingTo].catchItem(item.item);
      }
    }
  }

  public printCurrentState(): void {
    for (let [index, monkey] of this.monkeys.entries()) {
      console.log(`Monkey ${index}: ${monkey.worryLevels}`);
    }
  }

  public printMonkeyInspections(): void {
    for (let [index, monkey] of this.monkeys.entries()) {
      console.log(`Monkey ${index} inspected items ${monkey.inspectedItems}`);
    }

    const inspections = this.monkeys
      .map((monkey) => monkey.inspectedItems)
      .sort((a, b) => (a > b ? -1 : 1));

    console.log(
      `The level of MonkeyBusiness is found by multiplying\n ${
        inspections[0]
      } by ${inspections[1]}: ${inspections[0] * inspections[1]}`
    );
  }
}
