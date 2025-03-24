import run from "aocrunner";
import { parseLine } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const getWinningNumbersCount = (
  winningNumbers: Set<number>,
  playerNumbers: number[],
): number => {
  let count = 0;

  for (const n of playerNumbers) {
    if (winningNumbers.has(n)) {
      count++;
    }
  }

  return count;
};

const getArraysFromLine = (line: string) => {
  const { winningNumbers, playerNumbers } = parseLine(
    line,
    /Card[ 0-9]+: (?<winningNumbers>[0-9, ]+) \| (?<playerNumbers>[0-9, ]+)/,
  );

  const winningNumberArray: Set<number> = new Set(
    winningNumbers
      .split(" ")
      .filter((s) => s)
      .map((s) => parseInt(s)),
  );

  const playerNumberArray = playerNumbers
    .split(" ")
    .filter((s) => s)
    .map((s) => parseInt(s));

  return { winningNumberArray, playerNumberArray };
};

const part1 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  let sum = 0;

  for (const line of lines) {
    const { winningNumberArray, playerNumberArray } = getArraysFromLine(line);

    const winningCount = getWinningNumbersCount(
      winningNumberArray,
      playerNumberArray,
    );

    if (winningCount > 0) sum += Math.pow(2, winningCount - 1);
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);

  const scratchCards: Map<number, number> = new Map<number, number>();

  for (let i = 0; i < lines.length; i++) {
    let currentCardCount = scratchCards.get(i + 1) || 0;

    scratchCards.set(i + 1, currentCardCount + 1);

    currentCardCount = scratchCards.get(i + 1);

    const { winningNumberArray, playerNumberArray } = getArraysFromLine(
      lines[i],
    );

    const winningCount = getWinningNumbersCount(
      winningNumberArray,
      playerNumberArray,
    );

    for (let j = 1; j <= winningCount; j++) {
      scratchCards.set(
        i + 1 + j,
        (scratchCards.get(i + 1 + j) || 0) + currentCardCount,
      );
    }
  }

  return [...scratchCards.values()].reduce((prev, cur) => prev + cur, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
