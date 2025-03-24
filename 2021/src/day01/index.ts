import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n")
      .map((s) => +s);

const part1 = (rawInput: string) => {
  const depths: number[] = parseInput(rawInput);
  let increased = 0;

  for (let i = 1; i < depths.length; i++) {
    if (depths[i - 1] < depths[i]) increased++;
  }
  return increased;
};

const part2 = (rawInput: string) => {
  const depths: number[] = parseInput(rawInput);
  let windows = [];
  let increased = 0;

  for (let i = 0; i < depths.length - 2; i++) {
    windows.push(
        depths.slice(i, i + 3).reduce((cur, acc) => acc + cur, 0)
    );
  }

  for (let i = 1; i < windows.length; i++) {
    if (windows[i - 1] < windows[i]) increased++;
  }
  return increased;
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
