import run from "aocrunner";
import { Dijkstra } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.replace(/\r\n/g, "\n").replace(/\n*$/g, "").split("\n");

const createMap = (lines: string[], replicationCount: number): number[][] => {
  const map: number[][] = [];
  let intInput = lines.map((line) =>
    line.split("").map((v) => parseInt(v, 10)),
  );

  let height = intInput.length;
  let width = intInput[0].length;

  for (let y = 0; y < height * replicationCount; ++y) {
    map.push([]);
    for (let x = 0; x < width * replicationCount; ++x) {
      let addValue = Math.floor(x / width) + Math.floor(y / height);

      map[y].push(((intInput[y % height][x % width] + addValue - 1) % 9) + 1);
    }
  }
  return map;
};

const part1 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);
  const map = createMap(lines, 1);

  const dijkstra = new Dijkstra();
  dijkstra.parseMap(map);
  const val = dijkstra.getEndPointCostFromStart({
    x: map[0].length - 1,
    y: map.length - 1,
  });

  return val;
};

const part2 = (rawInput: string) => {
  const lines: string[] = parseInput(rawInput);

  return;
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
