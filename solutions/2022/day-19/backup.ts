import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

let print = false;

class Blueprint {
  id: number;
  oreRobotCost: number;
  clayRobotCost: number;
  obsidianRobotCost: {
    ore: number;
    clay: number;
  };
  geodeRobotCost: {
    ore: number;
    obsidian: number;
  };
}

class RobotCategory {
  id: string;
  numberOfActiveRobots: number;
  availableResources: number;

  newRobot = false;

  constructor(activeRobots?: number, availableResources?: number) {
    this.numberOfActiveRobots = activeRobots ? activeRobots : 0;
    this.availableResources = availableResources ? availableResources : 0;
  }

  addRobot() {
    this.numberOfActiveRobots++;
  }

  mining() {
    this.availableResources += this.numberOfActiveRobots;

    if (print && this.numberOfActiveRobots > 0) {
      console.log(
        `${this.numberOfActiveRobots} ${this.id}-collecting robot collects 1 ${this.id}; you now have ${this.availableResources} ${this.id}.`
      );
    }
  }
}

class OreRobots extends RobotCategory {
  constructor(activeRobots?: number, availableResources?: number) {
    super(activeRobots, availableResources);
    this.id = 'Ore';
  }
}

class ClayRobots extends RobotCategory {
  constructor(activeRobots?: number, availableResources?: number) {
    super(activeRobots, availableResources);
    this.id = 'Clay';
  }
}

class ObsidianRobots extends RobotCategory {
  constructor(activeRobots?: number, availableResources?: number) {
    super(activeRobots, availableResources);
    this.id = 'Obsidian';
  }
}

class GeodeRobots extends RobotCategory {
  constructor(activeRobots?: number, availableResources?: number) {
    super(activeRobots, availableResources);
    this.id = 'Geode';
  }
}

class State {
  minutesLeft: number;
  oreRobots: RobotCategory;
  clayRobots: RobotCategory;
  obsidianRobots: RobotCategory;
  geodeRobots: RobotCategory;

  constructor(
    minutesLeft: number,
    oreRobots: OreRobots,
    clayRobots: ClayRobots,
    obsidianRobots: ObsidianRobots,
    geodeRobots: GeodeRobots
  ) {
    this.minutesLeft = minutesLeft;
    this.oreRobots = oreRobots;
    this.clayRobots = clayRobots;
    this.obsidianRobots = obsidianRobots;
    this.geodeRobots = geodeRobots;
  }

  getKey(): string {
    return `${this.minutesLeft}:${this.oreRobots.numberOfActiveRobots}:${this.oreRobots.availableResources}:${this.clayRobots.numberOfActiveRobots}:${this.clayRobots.availableResources}:${this.obsidianRobots.numberOfActiveRobots}:${this.obsidianRobots.availableResources}:${this.geodeRobots.numberOfActiveRobots}:${this.geodeRobots.availableResources}`;
  }
}

class BlueprintAnalyser {
  blueprints: Blueprint[];
  analysisTime: number;
  remainingTime: number;

  oreRobots: RobotCategory;
  clayRobots: RobotCategory;
  obsidianRobots: RobotCategory;
  geodeRobots: RobotCategory;
  print: boolean;
  constructor(blueprints: Blueprint[], analysisTime: number, print: boolean) {
    this.blueprints = blueprints;
    this.analysisTime = analysisTime;
    this.print = print;
  }

  visited: Set<string>;
  queue: State[];
  best: number;
  initAnalysis(): void {
    // this.remainingTime = this.analysisTime;
    // this.oreRobots = new RobotCategory('ore', this.print);
    // this.clayRobots = new RobotCategory('clay', this.print);
    // this.obsidianRobots = new RobotCategory('obsidian', this.print);
    // this.geodeRobots = new RobotCategory('geode', this.print);

    this.visited = new Set<string>();
    this.queue = [];

    const initOreRobot = new OreRobots(1, 0);
    this.queue.push(
      new State(
        this.analysisTime,
        initOreRobot,
        new ClayRobots(),
        new ObsidianRobots(),
        new GeodeRobots()
      )
    );

    this.best = 0;
  }

  runAllAnalysis(): number {
    let allQualityLevels = 0;
    for (const blueprint of this.blueprints) {
      const qualityLevel = this.runAnalysis(blueprint);
      allQualityLevels += qualityLevel;
    }

    return allQualityLevels;
  }

  runAnalysis(blueprint: Blueprint): number {
    this.initAnalysis();
    const v1b = 7;
    const v2b = 12;
    const rgMax = [] as Array<number>;
    const visited = new Array<number[]>();

    // while (this.queue.length > 0) {
    for (let i = 0; i < 1e9 && this.queue.length > 0; i++) {
      debugger;
      const state = this.queue.pop();
      const {
        minutesLeft,
        oreRobots,
        clayRobots,
        obsidianRobots,
        geodeRobots,
      } = state;

      if (minutesLeft === 0) {
        console.log(oreRobots, clayRobots, obsidianRobots, geodeRobots);

        this.best = Math.max(this.best, geodeRobots.availableResources);
        continue;
      }

      // let rg = rgMax[minutesLeft];
      // if (rg === undefined) {
      //   rg = 0;
      //   for (let m = 1; m <= minutesLeft; m++) {
      //     rg += m * (minutesLeft - m);
      //   }
      //   rgMax[minutesLeft] = rg;
      // }

      // const theoreticalBest =
      //   geodeRobots.availableResources +
      //   geodeRobots.numberOfActiveRobots * minutesLeft +
      //   rg;
      // if (theoreticalBest <= this.best) {
      //   continue;
      // }

      if (this.visited.has(state.getKey())) {
        continue;
      }
      this.visited.add(state.getKey());

      // Check visisted.
      // const visitedKey1 =
      //   ((minutesLeft & ((1 << (v1b + 1)) - 1)) << (v1b * 0)) +
      //   ((oreRobots.numberOfActiveRobots & ((1 << (v1b + 1)) - 1)) <<
      //     (v1b * 1)) +
      //   ((clayRobots.numberOfActiveRobots & ((1 << (v1b + 1)) - 1)) <<
      //     (v1b * 2)) +
      //   ((obsidianRobots.numberOfActiveRobots & ((1 << (v1b + 1)) - 1)) <<
      //     (v1b * 3)) +
      //   ((geodeRobots.numberOfActiveRobots & ((1 << (v1b + 1)) - 1)) <<
      //     (v1b * 4));
      // const visitedKey2 =
      //   ((oreRobots.availableResources & ((1 << (v2b + 1)) - 1)) << (v2b * 0)) +
      //   ((clayRobots.availableResources & ((1 << (v2b + 1)) - 1)) <<
      //     (v2b * 1)) +
      //   ((obsidianRobots.availableResources & ((1 << (v2b + 1)) - 1)) <<
      //     (v2b * 2)) +
      //   ((geodeRobots.availableResources & ((1 << (v2b + 1)) - 1)) <<
      //     (v2b * 3));
      // const isVisited = visited[visitedKey1]?.[visitedKey2];
      // if (isVisited > 0) {
      //   continue;
      // }
      // if (!visited[visitedKey1]) {
      //   visited[visitedKey1] = new Array<number>();
      // }
      // visited[visitedKey1][visitedKey2] = 1;

      // Option 1 - Buy geode robot if possible.
      if (
        oreRobots.availableResources >= blueprint.geodeRobotCost.ore &&
        obsidianRobots.availableResources >= blueprint.geodeRobotCost.obsidian
      ) {
        this.queue.push(
          new State(
            minutesLeft - 1,
            new OreRobots(
              oreRobots.numberOfActiveRobots,
              oreRobots.availableResources +
                oreRobots.numberOfActiveRobots -
                blueprint.geodeRobotCost.ore
            ),
            new ClayRobots(
              clayRobots.numberOfActiveRobots,
              clayRobots.availableResources + clayRobots.numberOfActiveRobots
            ),
            new ObsidianRobots(
              obsidianRobots.numberOfActiveRobots,
              obsidianRobots.availableResources +
                obsidianRobots.numberOfActiveRobots -
                blueprint.geodeRobotCost.obsidian
            ),
            new GeodeRobots(
              geodeRobots.numberOfActiveRobots + 1,
              geodeRobots.availableResources + geodeRobots.numberOfActiveRobots
            )
          )
        );
        // Stop here, because no need to hoard obsidian.
        continue;
      }
      let boughtRobot = false;

      // Option 2 - Buy obsidian robot
      if (
        clayRobots.availableResources >= blueprint.obsidianRobotCost.clay &&
        oreRobots.availableResources >= blueprint.obsidianRobotCost.ore
      ) {
        this.queue.push(
          new State(
            minutesLeft - 1,
            new OreRobots(
              oreRobots.numberOfActiveRobots,
              oreRobots.availableResources +
                oreRobots.numberOfActiveRobots -
                blueprint.obsidianRobotCost.ore
            ),
            new ClayRobots(
              clayRobots.numberOfActiveRobots,
              clayRobots.availableResources +
                clayRobots.numberOfActiveRobots -
                blueprint.obsidianRobotCost.clay
            ),
            new ObsidianRobots(
              obsidianRobots.numberOfActiveRobots + 1,
              obsidianRobots.availableResources +
                obsidianRobots.numberOfActiveRobots
            ),
            new GeodeRobots(
              geodeRobots.numberOfActiveRobots,
              geodeRobots.availableResources + geodeRobots.numberOfActiveRobots
            )
          )
        );
        boughtRobot = true;
      }

      // Option 3 - buy clay robot.
      if (oreRobots.availableResources >= blueprint.clayRobotCost) {
        this.queue.push(
          new State(
            minutesLeft - 1,
            new OreRobots(
              oreRobots.numberOfActiveRobots,
              oreRobots.availableResources +
                oreRobots.numberOfActiveRobots -
                blueprint.clayRobotCost
            ),
            new ClayRobots(
              clayRobots.numberOfActiveRobots + 1,
              clayRobots.availableResources + clayRobots.numberOfActiveRobots
            ),
            new ObsidianRobots(
              obsidianRobots.numberOfActiveRobots,
              obsidianRobots.availableResources +
                obsidianRobots.numberOfActiveRobots
            ),
            new GeodeRobots(
              geodeRobots.numberOfActiveRobots,
              geodeRobots.availableResources + geodeRobots.numberOfActiveRobots
            )
          )
        );
        boughtRobot = true;
      }

      // Option 4 - buy ore robot.
      if (oreRobots.availableResources >= blueprint.oreRobotCost) {
        this.queue.push(
          new State(
            minutesLeft - 1,
            new OreRobots(
              oreRobots.numberOfActiveRobots + 1,
              oreRobots.availableResources +
                oreRobots.numberOfActiveRobots -
                blueprint.oreRobotCost
            ),
            new ClayRobots(
              clayRobots.numberOfActiveRobots,
              clayRobots.availableResources + clayRobots.numberOfActiveRobots
            ),
            new ObsidianRobots(
              obsidianRobots.numberOfActiveRobots,
              obsidianRobots.availableResources +
                obsidianRobots.numberOfActiveRobots
            ),
            new GeodeRobots(
              geodeRobots.numberOfActiveRobots,
              geodeRobots.availableResources + geodeRobots.numberOfActiveRobots
            )
          )
        );
      }

      // Option 5 - Do nothing. Let robots collect things.
      if (!boughtRobot) {
        this.queue.push(
          new State(
            minutesLeft - 1,
            new OreRobots(
              oreRobots.numberOfActiveRobots,
              oreRobots.availableResources + oreRobots.numberOfActiveRobots
            ),
            new ClayRobots(
              clayRobots.numberOfActiveRobots,
              clayRobots.availableResources + clayRobots.numberOfActiveRobots
            ),
            new ObsidianRobots(
              obsidianRobots.numberOfActiveRobots,
              obsidianRobots.availableResources +
                obsidianRobots.numberOfActiveRobots
            ),
            new GeodeRobots(
              geodeRobots.numberOfActiveRobots,
              geodeRobots.availableResources + geodeRobots.numberOfActiveRobots
            )
          )
        );
      }
    }

    return this.best * blueprint.id;
  }

  //   while (this.remainingTime--) {
  //     if (this.print) {
  //       console.log(`== Minute ${this.analysisTime - this.remainingTime} ==`);
  //     }
  //     let keepOre = false;
  //     //Can I build a Geode robot now ?
  //     if (
  //       this.obsidianRobots.availableResources >=
  //         blueprint.geodeRobotCost.obsidianCost &&
  //       this.oreRobots.availableResources >= blueprint.geodeRobotCost.oreCost
  //     ) {
  //       if (this.print) {
  //         console.log(
  //           `Spend ${blueprint.geodeRobotCost.oreCost} ore and ${blueprint.geodeRobotCost.obsidianCost} obsidian to start building a geode-collecting robot.`
  //         );
  //       }
  //       this.geodeRobots.addRobot();
  //       this.obsidianRobots.availableResources -=
  //         blueprint.geodeRobotCost.obsidianCost;
  //       this.oreRobots.availableResources -= blueprint.geodeRobotCost.oreCost;
  //     } else if (
  //       this.obsidianRobots.availableResources +
  //         this.obsidianRobots.numberOfActiveRobots * 2 >=
  //         blueprint.geodeRobotCost.obsidianCost &&
  //       this.oreRobots.availableResources +
  //         this.oreRobots.numberOfActiveRobots * 2 >=
  //         blueprint.geodeRobotCost.oreCost &&
  //       !(
  //         this.oreRobots.availableResources +
  //           this.oreRobots.numberOfActiveRobots * 2 >=
  //         blueprint.geodeRobotCost.oreCost + blueprint.obsidianRobotCost.oreCost
  //       )
  //     ) {
  //       keepOre = true;
  //     }

  //     if (
  //       !keepOre &&
  //       this.clayRobots.availableResources >=
  //         blueprint.obsidianRobotCost.clayCost &&
  //       this.oreRobots.availableResources >= blueprint.obsidianRobotCost.oreCost
  //     ) {
  //       if (this.print) {
  //         console.log(
  //           `Spend ${blueprint.obsidianRobotCost.oreCost} ore and ${blueprint.obsidianRobotCost.clayCost} clay to start building a obsidian-collecting robot.`
  //         );
  //       }
  //       this.obsidianRobots.addRobot();
  //       this.clayRobots.availableResources -=
  //         blueprint.obsidianRobotCost.clayCost;
  //       this.oreRobots.availableResources -=
  //         blueprint.obsidianRobotCost.oreCost;
  //     } else if (
  //       this.clayRobots.availableResources +
  //         this.clayRobots.numberOfActiveRobots * 2 >=
  //         blueprint.obsidianRobotCost.clayCost &&
  //       this.oreRobots.availableResources +
  //         this.oreRobots.numberOfActiveRobots * 2 >=
  //         blueprint.obsidianRobotCost.oreCost &&
  //       this.oreRobots.availableResources +
  //         this.oreRobots.numberOfActiveRobots * 2 >=
  //         blueprint.obsidianRobotCost.oreCost + blueprint.clayRobotCost
  //     ) {
  //       keepOre = true;
  //     }

  //     if (
  //       !keepOre &&
  //       this.oreRobots.availableResources >= blueprint.clayRobotCost
  //     ) {
  //       if (this.print) {
  //         console.log(
  //           `Spend ${blueprint.clayRobotCost} ore to start building a clay-collecting robot.`
  //         );
  //       }
  //       this.clayRobots.addRobot();
  //       this.oreRobots.availableResources -= blueprint.clayRobotCost;
  //     } else if (
  //       this.oreRobots.availableResources +
  //         this.oreRobots.numberOfActiveRobots * 2 >=
  //         blueprint.clayRobotCost &&
  //       this.oreRobots.availableResources +
  //         this.oreRobots.numberOfActiveRobots * 2 >=
  //         blueprint.clayRobotCost + blueprint.oreRobotCost
  //     ) {
  //       keepOre = true;
  //     }

  //     if (
  //       !keepOre &&
  //       this.oreRobots.availableResources >= blueprint.oreRobotCost
  //     ) {
  //       if (this.print) {
  //         console.log(
  //           `Spend ${blueprint.oreRobotCost} ore to start building a ore-collecting robot.`
  //         );
  //       }
  //       this.oreRobots.addRobot();
  //       this.oreRobots.availableResources -= blueprint.oreRobotCost;
  //     }

  //     this.oreRobots.mining();
  //     this.clayRobots.mining();
  //     this.obsidianRobots.mining();
  //     this.geodeRobots.mining();

  //     if (this.print) {
  //       console.log(' ');
  //     }
  //   }
  //   return this.geodeRobots.availableResources * blueprint.id;
  // }
}

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

  blueprints: Blueprint[] = [];

  constructor({
    year,
    day,
    testing,
  }: {
    year: string;
    day: string;
    testing: boolean;
  }) {
    this.year = year;
    this.day = day;
    this.file = parseFile(year, day, testing ? 'test' : 'data');
    this.lines = this.file.split('\n');
    this.lines.forEach((line) => {
      const {
        id,
        oreRobotCost,
        clayRobotCost,
        obsidianRobotCostInOre,
        obsidianRobotCostInClay,
        geodeRobotCostInOre,
        geodeRobotCostInObsidian,
      } = parseLine(
        line,
        /Blueprint (?<id>.+): Each ore robot costs (?<oreRobotCost>.+) ore. Each clay robot costs (?<clayRobotCost>.+) ore. Each obsidian robot costs (?<obsidianRobotCostInOre>.+) ore and (?<obsidianRobotCostInClay>.+) clay. Each geode robot costs (?<geodeRobotCostInOre>.+) ore and (?<geodeRobotCostInObsidian>.+) obsidian./
      );
      this.blueprints.push({
        id: +id,
        oreRobotCost: +oreRobotCost,
        clayRobotCost: +clayRobotCost,
        obsidianRobotCost: {
          ore: +obsidianRobotCostInOre,
          clay: +obsidianRobotCostInClay,
        },
        geodeRobotCost: {
          ore: +geodeRobotCostInOre,
          obsidian: +geodeRobotCostInObsidian,
        },
      });
    });
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    const analyser = new BlueprintAnalyser(this.blueprints, 24, true);
    logger.info(analyser.runAnalysis(this.blueprints[0]));
    const result = 0;
    logger.result(result);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    const result = 0;
    logger.result(result);
  }
}

const year = '2022';
const day = '19';
const testing = true;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
// resolver.solve2()
