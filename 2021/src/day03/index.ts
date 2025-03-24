import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const calculateRating= (input: string[], isOxygenGeneratorRating: boolean) => {
  for (let i = 0; i < input[0].length && input.length > 1; i++) {
    let count0 = 0;
    let count1 = 0;

    for (let j = 0; j < input.length; j++) {
      if (input[j][i] === '0') {
        count0++;
      } else {
        count1++;
      }
    }

    let criteria: number;
    if (isOxygenGeneratorRating) {
      criteria = count0 > count1 ? 0 : 1;
    } else {
      criteria = count0 > count1 ? 1 : 0;
    }

    input = input.filter((x) => x[i] === criteria.toString());
  }

  return parseInt(input[0], 2);
}

const part1 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  let gammaBits: number[] = [];

  for (let i = 0; i < lines[0].length; i++) {
    let count0 = 0;
    let count1 = 0;
    for (let j = 0; j < lines.length; j++) {
      if (lines[j][i] === '0') {
        count0++;
      } else {
        count1++;
      }
    }

    gammaBits[i] = count0 > count1 ? 0 : 1;
  }

  const gamma = parseInt(gammaBits.join(''), 2);
  const epsilon = parseInt(gammaBits.map((b) => 1 - b).join(''), 2);
  return gamma * epsilon;
};

const part2 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  const oxygenGeneratorRating = calculateRating(lines, true);
  const co2ScrubberRating = calculateRating(lines, false);
  return oxygenGeneratorRating * co2ScrubberRating;
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
