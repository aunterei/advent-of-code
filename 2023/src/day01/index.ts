import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const part1 = (rawInput: string) => {
  const input: string[] = parseInput(rawInput);
  return input
    .map((s) => s.replace(/[a-z]+/g, ""))
    .reduce(
      (previousValue: number, currentValue: string) =>
        previousValue +
        parseInt(
          currentValue.charAt(0) + currentValue.charAt(currentValue.length - 1),
        ),
      0,
    );
};

const NumberMap: Map<string, string> = new Map<string, string>([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);

  return input
    .map((line: string) => {
      const firstOccurence: string = line.match(
        /\d|one|two|three|four|five|six|seven|eight|nine/,
      )[0];
      const lastOccurence: string = line.match(
        /.*(\d|one|two|three|four|five|six|seven|eight|nine)/,
      )[1];

      return (
        (NumberMap.get(firstOccurence) ?? firstOccurence) +
        (NumberMap.get(lastOccurence) ?? lastOccurence)
      );
    })
    .reduce(
      (previousValue, currentValue) => previousValue + parseInt(currentValue),
      0,
    );
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
