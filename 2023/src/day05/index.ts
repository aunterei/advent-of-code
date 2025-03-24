import run from "aocrunner";
interface Mapping {
  destStart: number;
  destEnd: number;
  srcStart: number;
  srcEnd: number;
}

class Game {
  private readonly maps: Map[] = [];
  private readonly seeds: number[];
  private readonly log: boolean;
  private readonly treatSeedsAsRange: boolean;
  constructor(
    input: string[],
    treatSeedsAsRange: boolean = false,
    log: boolean = false,
  ) {
    this.treatSeedsAsRange = treatSeedsAsRange;
    this.seeds = input[0]
      .split(" ")
      .slice(1)
      .map((s) => parseInt(s));

    this.log = log;

    for (let i = 1; i < input.length; i++) {
      this.maps.push(new Map(input[i].split("\n"), this.log));
    }
  }

  public getLowestDestinationSeed(): number {
    let lowest = Number.MAX_SAFE_INTEGER;

    if (this.treatSeedsAsRange) {
      for (let i = 0; i < this.seeds.length; i += 2) {
        for (
          let j = this.seeds[i];
          j < this.seeds[i] + this.seeds[i + 1];
          j++
        ) {
          lowest = Math.min(this.getDestinationValue(j), lowest);
        }
      }
    } else {
      for (const seed of this.seeds) {
        if (this.log) console.log(`-------------------\nTesting seed: ${seed}`);
        lowest = Math.min(this.getDestinationValue(seed), lowest);
      }
    }

    return lowest;
  }

  private getDestinationValue(seed: number): number {
    let destination = seed;

    for (const map of this.maps) {
      const temp = map.getMapDestinationValue(destination);
      if (this.log) {
        console.log(
          `Seed going through map --> ${map.getMapName()} ${destination} to ${temp}`,
        );
      }
      destination = temp;
    }

    return destination;
  }
}

class Map {
  private readonly mapLabel: string;
  private readonly log: boolean;

  private ranges: MapRange[] = [];
  constructor(mapDefinition: string[], log: boolean) {
    this.log = log;
    this.mapLabel = mapDefinition[0];

    for (let i = 1; i < mapDefinition.length; i++) {
      const rangeDef = mapDefinition[i].split(" ").map((s) => parseInt(s));

      this.ranges.push(
        new MapRange(rangeDef[0], rangeDef[1], rangeDef[2], this.log),
      );
    }
  }

  public getMapName = (): string => this.mapLabel;

  public getMapDestinationValue(sourceValue: number): number {
    let destination: number | undefined;

    for (const range of this.ranges) {
      if (this.log) {
        console.log(`Testing range ${range.rangeToString()}`);
      }
      destination = range.getRangeDestinationValueOrUndefined(sourceValue);

      if (destination) {
        if (this.log) {
          console.log(`Found!`);
        }
        return destination;
      }
    }

    if (!destination) {
      if (this.log) {
        console.log("Not Found => returning same value");
      }
      return sourceValue;
    }
  }
}

class MapRange {
  private readonly log: boolean;

  public sourceRangeStart: number;
  public destRangeStart: number;
  public rangeLength: number;

  constructor(
    destRangeStart: number,
    sourceRangeStart: number,
    rangeLength: number,
    log: boolean,
  ) {
    this.log = log;
    this.sourceRangeStart = sourceRangeStart;
    this.destRangeStart = destRangeStart;
    this.rangeLength = rangeLength;
  }

  public rangeToString = () =>
    `Source Start: ${this.sourceRangeStart} - Dest start: ${this.destRangeStart} - Range Length: ${this.rangeLength}`;

  public getRangeDestinationValueOrUndefined(
    sourceValue: number,
  ): number | undefined {
    if (
      sourceValue < this.sourceRangeStart ||
      sourceValue > this.sourceRangeStart + this.rangeLength
    )
      return undefined;

    return this.destRangeStart + (sourceValue - this.sourceRangeStart);
  }
}

const parseInput = (
  rawInput: string,
): {
  seeds: number[];
  mapMatrix: Mapping[][];
} => {
  const lines = rawInput.split("\n\n");
  const seeds = lines.shift()!.split(":")[1].trim().split(" ").map(Number);
  const mapMatrix = lines.map((line) =>
    line
      .split("\n")
      .slice(1)
      .map((s) => s.split(" ").map(Number))
      .map(([destStart, srcStart, length]) => ({
        destStart,
        destEnd: destStart + length - 1,
        srcStart,
        srcEnd: srcStart + length - 1,
      })),
  );
  return { seeds, mapMatrix };
};

function lookupLocation(mapMatrix: Mapping[][], val: number) {
  return mapMatrix.reduce((curr, mappings) => {
    for (let i = 0; i < mappings.length; i++) {
      const m = mappings[i];
      if (curr >= m.srcStart && curr <= m.srcEnd) {
        return m.destStart + (curr - m.srcStart);
      }
    }
    return curr; // No mapping, same number
  }, val);
}

function lookupSeed(mapMatrix: Mapping[][], val: number) {
  // Backwards lookup
  return mapMatrix.reduceRight((curr, mappings) => {
    for (let i = 0; i < mappings.length; i++) {
      const m = mappings[i];
      if (curr >= m.destStart && curr <= m.destEnd) {
        return m.srcStart + (curr - m.destStart);
      }
    }
    return curr; // No mapping, same number
  }, val);
}

const part1 = (rawInput: string) => {
  const { seeds, mapMatrix } = parseInput(rawInput);
  return Math.min(...seeds.map((s) => lookupLocation(mapMatrix, s)));
};

const part2 = (rawInput: string) => {
  const { seeds, mapMatrix } = parseInput(rawInput);
  const validSeed = (seed: number) => {
    for (let i = 0; i < seeds.length; i += 2) {
      if (seed >= seeds[i] && seed < seeds[i] + seeds[i + 1]) return true;
    }
    return false;
  };
  // I think lowest location will correspond to some lower bound in a mapping
  const candidateSeeds = mapMatrix
    .flatMap((mappings, i) =>
      mappings.map((m) => lookupSeed(mapMatrix.slice(0, i + 1), m.destStart)),
    )
    .filter(validSeed);

  return Math.min(...candidateSeeds.map((s) => lookupLocation(mapMatrix, s)));
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
