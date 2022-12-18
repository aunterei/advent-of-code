import { AdvancedSet } from 'lib/advanced-set';
import { Edge, FloydWarshall } from 'lib/floyd-warshall';
import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Valve {
  id: string;
  flowRate: number;
  opened: Set<String>;
  remainingTime: number;
  totalFlow: number;
  constructor(
    id: string,
    flowRate: number,
    opened: Set<String>,
    remainingTime: number,
    totalFlow: number
  ) {
    this.id = id;
    this.opened = opened;
    this.flowRate = flowRate;
    this.remainingTime = remainingTime;
    this.totalFlow = totalFlow;
  }

  toString(): string {
    return `${this.id}:${this.remainingTime}:${this.opened}:${this.totalFlow}`;
  }
}

class Resolver {
  year: string;
  day: string;
  file: string;
  allValves: Valve[] = [];
  remainingTime = 30;

  graph: FloydWarshall<string>;
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
    const edges: Edge<string>[] = [];

    this.file.split('\n').forEach((line) => {
      const { id, flowRate, adjacencies } = parseLine(
        line,
        /Valve (?<id>.+) has flow rate=(?<flowRate>.+); (?:tunnels lead to valves|tunnel leads to valve) (?<adjacencies>.+)/
      );

      const valve = new Valve(id, +flowRate, new Set<String>(), 0, 0);

      this.allValves.push(valve);

      for (const adjacent of adjacencies.split(',').map((s) => s.trim())) {
        edges.push({ from: id, to: adjacent, weight: 1 });
      }
    });

    this.graph = new FloydWarshall(edges, false);
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    let maxRelease = 0;
    this.compute(30, (currentValve: Valve) => {
      maxRelease = Math.max(maxRelease, currentValve.totalFlow);
    });

    logger.result(maxRelease);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    let maxRelease = 0;
    const releaseWhenTimesEnd = new Map<String[], number>();

    //Computing and saving which valves are opened when time's up for all possibilities
    this.compute(26, (valve: Valve) => {
      const openedValveString = Array.from(valve.opened);
      releaseWhenTimesEnd.set(
        openedValveString,
        Math.max(
          releaseWhenTimesEnd.get(openedValveString) ?? 0,
          valve.totalFlow
        )
      );
    });

    //Checking two path that do not overlap and saving the maximum flow
    for (const [opened1, totalFlow1] of releaseWhenTimesEnd) {
      for (const [opened2, totalFlow2] of releaseWhenTimesEnd) {
        const overlap = opened1.filter((s) => opened2.indexOf(s) !== -1);
        if (overlap.length !== 0) continue;
        maxRelease = Math.max(maxRelease, totalFlow1 + totalFlow2);
      }
    }
    logger.result(maxRelease);
  }

  private compute(maxTime: number, actionOnVisited: (valve: Valve) => void) {
    const queue: Valve[] = [];

    const start = this.allValves.find((v) => v.id === 'AA');

    if (!start) return;

    queue.push(
      new Valve(start.id, start.flowRate, new Set<string>(), maxTime, 0)
    );
    const visited = new AdvancedSet<Valve>((valve: Valve) => valve.toString());

    while (queue.length > 0) {
      const current = queue.pop();

      if (visited.has(current)) continue;

      visited.add(current);

      actionOnVisited(current);

      if (current.remainingTime === 0) continue;

      for (const nextValve of this.allValves.filter((v) => v.flowRate > 0)) {
        if (current.opened.has(nextValve.id)) continue;

        const remainingTimeWhenNextOpened =
          current.remainingTime -
          this.graph.getShortestDistance(current.id, nextValve.id) -
          1;

        if (remainingTimeWhenNextOpened <= 0) continue;

        queue.push(
          new Valve(
            nextValve.id,
            nextValve.flowRate,
            new Set(current.opened).add(nextValve.id),
            remainingTimeWhenNextOpened,
            current.totalFlow + remainingTimeWhenNextOpened * nextValve.flowRate
          )
        );
      }
    }
  }
}

const year = '2022';
const day = '16';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
