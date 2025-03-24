export class Monkey {
  inspectedItems: number;
  worryLevels: number[];
  operator: string;
  factor: string;
  testDivision: number;
  ifTrueThrowTo: number;
  ifFalseThrowTo: number;
  reliefMode: boolean;
  manageWorryLevels: boolean;
  commonDenominator: number;

  constructor(
    worryLevels: number[],
    operator: string,
    factor: string,
    testDivision: number,
    ifTrueThrowTo: number,
    ifFalseThrowTo: number,
    reliefMode: boolean,
    manageWorryLevels: boolean
  ) {
    this.inspectedItems = 0;
    this.worryLevels = worryLevels;
    this.operator = operator;
    this.factor = factor;
    this.testDivision = testDivision;
    this.ifTrueThrowTo = ifTrueThrowTo;
    this.ifFalseThrowTo = ifFalseThrowTo;
    this.reliefMode = reliefMode;
    this.manageWorryLevels = manageWorryLevels;
  }

  public doMonkeyTurn(commonDenominator: number): ItemThrow[] {
    const throwedItems: ItemThrow[] = [];

    for (let worryLevel of this.worryLevels) {
      this.inspectedItems++;

      const numberFactor = this.factor === 'old' ? worryLevel : +this.factor;

      if (this.operator === '+') {
        worryLevel += numberFactor;
      } else if (this.operator === '*') {
        worryLevel *= numberFactor;
      }

      if (this.reliefMode) {
        worryLevel = Math.floor(worryLevel / 3);
      }

      if (this.manageWorryLevels) {
        worryLevel = worryLevel % commonDenominator;
      }

      const testPassed = worryLevel % this.testDivision === 0;

      throwedItems.push({
        throwingTo: testPassed ? this.ifTrueThrowTo : this.ifFalseThrowTo,
        item: worryLevel,
      });
    }

    this.worryLevels = [];

    return throwedItems;
  }

  public catchItem(item: number) {
    this.worryLevels.push(item);
  }
}

export interface ItemThrow {
  throwingTo: number;
  item: number;
}
