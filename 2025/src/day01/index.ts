import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  return solution( parseInput(rawInput).trim().split("\n"), 'part1');
};

const part2 = (rawInput: string) => {
  return solution( parseInput(rawInput).trim().split("\n"), 'part2');
};

const solution = (input: string[], part: "part1" | "part2") => {
  let pos = 50;
  let count = 0;
  for (const line of input) {
    const rotation = Number(line.slice(1)) * (line[0] == "L" ? -1 : 1);
    const newPos = (pos + rotation + 100) % 100;
    count +=
      part === "part1"
        ? newPos === 0
          ? 1
          : 0
        : rotation > 0
        ? Math.floor((pos + rotation) / 100) - Math.floor(pos / 100)
        : Math.floor((pos - 1) / 100) - Math.floor((pos - 1 + rotation) / 100);
    pos = newPos;
  }
  return count
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
      {
        input: ``,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
