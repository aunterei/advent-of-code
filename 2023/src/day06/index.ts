import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const getLineNumericValues = (line: string): number[] => {
  return [...line.matchAll(new RegExp(/(?<number>[0-9]+)/, "g"))].map(
    (e) => +e.groups.number,
  );
};

const getLineConcatNumericValue = (line: string): number => {
  return +[...line.matchAll(new RegExp(/(?<number>[0-9]+)/, "g"))]
    .map((e) => e.groups.number)
    .reduce((prev, cur) => prev + cur);
};

const getMinimalValidTime = (
  raceTime: number,
  distanceToBeat: number,
): number => {
  //i = 0 and i = raceTime results in 0 distance
  for (let i = 1; i < raceTime - 1; i++) {
    const distance = getDistance(i, raceTime);
    if (distance > distanceToBeat) return i;
  }
};

const getMaximalValidTime = (
  raceTime: number,
  distanceToBeat: number,
  minimalValidTime: number,
): number => {
  //Does not need to check values below minValidTime
  for (let i = raceTime - 1; i > minimalValidTime; i--) {
    const distance = getDistance(i, raceTime);
    if (distance > distanceToBeat) return i;
  }
};

const getDistance = (buttonPushDuration: number, raceTime: number) => {
  return (raceTime - buttonPushDuration) * buttonPushDuration;
};

const part1 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  const times: number[] = getLineNumericValues(lines[0]);
  const distances: number[] = getLineNumericValues(lines[1]);

  let score = 1;

  for (let i = 0; i < times.length; i++) {
    const min = getMinimalValidTime(times[i], distances[i]);
    const max = getMaximalValidTime(times[i], distances[i], min);

    score *= max - min + 1;
  }
  return score;
};

const part2 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  const time: number = getLineConcatNumericValue(lines[0]);
  const distance: number = getLineConcatNumericValue(lines[1]);
  const min = getMinimalValidTime(time, distance);
  const max = getMaximalValidTime(time, distance, min);
  return max - min + 1;
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
                Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
                Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
