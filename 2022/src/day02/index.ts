import run from "aocrunner";
import { parseLine } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const baseScore = {
  X: 1,
  Y: 2,
  Z: 3,
};

const opponentLoose = {
  A: "Y",
  B: "Z",
  C: "X",
};

const draw = {
  A: "X",
  B: "Y",
  C: "Z",
};

const opponentWin = {
  A: "Z",
  B: "X",
  C: "Y",
};

const part1 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  let score = 0;
  lines.forEach((line) => {
    const { opponent, me } = parseLine(line, /(?<opponent>.+) (?<me>.+)/);

    score += baseScore[me];

    if (opponentLoose[opponent] === me) score += 6;
    else if (draw[opponent] === me) score += 3;
  });

  return score;
};

const part2 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  let score = 0;
  lines.forEach((line) => {
    const { opponent, outcome } = parseLine(
      line,
      /(?<opponent>.+) (?<outcome>.+)/,
    );

    if (outcome === "X") {
      score += baseScore[opponentWin[opponent]];
    } else if (outcome === "Y") {
      score += 3 + baseScore[draw[opponent]];
    } else {
      score += 6 + baseScore[opponentLoose[opponent]];
    }
  });

  return score;
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
