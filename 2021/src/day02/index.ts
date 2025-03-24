import run from "aocrunner";
import {Coordinates, parseLine} from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const parseInstructions = (lines: string[]) => {
  const coordinates = new Coordinates(0, 0);
  let aim = 0;

  lines.forEach((line) => {
    const { command, value } = parseLine(line, /(?<command>.+) (?<value>.+)/);

    switch (command) {
      case 'forward':
        coordinates.x += +value;
        coordinates.y += aim * value;
        break;
      case 'down':
        aim += +value;
        break;
      case 'up':
        aim -= +value;
        break;
    }
  });
  return { x: coordinates.x, y: coordinates.y, aim: aim };
}


const part1 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  const { x, aim } = parseInstructions(lines);
  return x * aim;
};

const part2 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  const { x, y } = parseInstructions(lines);
  return x * y;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
