import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let max = 0;
  let acc = 0;

  lines.forEach((line) => {
    if (line === "") {
      max = Math.max(max, acc);
      acc = 0;
    } else {
      acc += +line;
    }
  });

  return max;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let acc = 0;
  let elvesCal = [];

  lines.forEach((line) => {
    if (line === "") {
      elvesCal.push(acc);
      acc = 0;
    } else {
      acc += +line;
    }
  });

  return elvesCal
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, cur) => sum + cur, 0);
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
