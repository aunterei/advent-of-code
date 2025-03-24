import run from "aocrunner";
import { AdvancedSet, Coordinates, getAllNeighbors } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput
    .replace(/\r\n/g, "\n")
    .replace(/\n*$/g, "")
    .split("\n")
    .map((line: string) => line.split(""));

const isSpecialChar = (char: string) => isNaN(+char) && char !== ".";
const isCharANumber = (char: string) => !isNaN(+char);

const part1 = (rawInput: string) => {
  const map: string[][] = parseInput(rawInput);

  let parsingNumber = false;
  let foundSpecialChar = false;
  let currentParsingNumber = "";

  let sum = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const char: string = map[y][x];

      if (isCharANumber(char)) {
        if (!foundSpecialChar) {
          const charCoordinates = new Coordinates(x, y);
          const neighbours = getAllNeighbors(charCoordinates, map);

          for (const neighbour of neighbours) {
            if (isSpecialChar(map[neighbour.y][neighbour.x])) {
              foundSpecialChar = true;
            }
          }
        }

        parsingNumber = true;
        currentParsingNumber += char;
      } else {
        parsingNumber = false;

        if (foundSpecialChar) {
          sum += +currentParsingNumber;
          foundSpecialChar = false;
        }

        currentParsingNumber = "";
      }
    }
  }
  return sum;
};

const part2 = (rawInput: string) => {
  const map: string[][] = parseInput(rawInput);
  let parsingNumber = false;
  let foundSpecialChar = false;
  let charIsStar = false;
  let currentParsingNumber = "";
  let gears = new Map<string, string[]>();
  let specialCharKey = "";
  let sum = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const char: string = map[y][x];

      if (isCharANumber(char)) {
        if (!foundSpecialChar) {
          const charCoordinates = new Coordinates(x, y);
          const neighbours = getAllNeighbors(charCoordinates, map);

          for (const neighbour of neighbours) {
            if (isSpecialChar(map[neighbour.y][neighbour.x])) {
              foundSpecialChar = true;
              charIsStar = map[neighbour.y][neighbour.x] === "*";
              specialCharKey = `[${neighbour.x},${neighbour.y}]`;
              break;
            }
          }
        }

        parsingNumber = true;
        currentParsingNumber += char;
      } else {
        parsingNumber = false;

        if (foundSpecialChar) {
          foundSpecialChar = false;
          if (charIsStar) {
            const getting = gears.get(specialCharKey) || [];
            getting.push(currentParsingNumber);

            gears.set(specialCharKey, getting);
            specialCharKey = "";
            charIsStar = false;
          }
        }

        currentParsingNumber = "";
      }
    }
  }

  gears.forEach((value, key) => {
    if (value.length > 1) {
      console.log(value);
      sum += value.reduce((prev, cur) => prev * +cur, 1);
    }
  });
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
