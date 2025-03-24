import run from "aocrunner";
import { parseLine } from "../utils/index.js";

enum Gem {
  Green = "green",
  Red = "red",
  Blue = "blue",
}

const MAXRED = 12;
const MAXGREEN = 13;
const MAXBLUE = 14;

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const getMaxGems = (line: string, gemColor: string): number => {
  const interpolatedRegex = new RegExp(
    `(?<${gemColor}>[0-9]+) ${gemColor}[;|,]*`,
    "g",
  );
  const gemValues = [...line.matchAll(interpolatedRegex)].map(
    (e) => +e.groups[gemColor],
  );

  return Math.max(...gemValues);
};

const part1 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);

  const validIds: number[] = [];

  for (const line of lines) {
    const { gamedId } = parseLine(line, /Game (?<gamedId>[0-9]+):/);

    if (getMaxGems(line, Gem.Red) > MAXRED) continue;

    if (getMaxGems(line, Gem.Green) > MAXGREEN) continue;

    if (getMaxGems(line, Gem.Blue) > MAXBLUE) continue;

    validIds.push(+gamedId);
  }

  return validIds.reduce((prev, cur) => prev + cur);
};

const part2 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  const powers: number[] = [];

  for (const line of lines) {
    powers.push(
      getMaxGems(line, Gem.Red) *
        getMaxGems(line, Gem.Green) *
        getMaxGems(line, Gem.Blue),
    );
  }

  return powers.reduce((prev, cur) => prev + cur);
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
