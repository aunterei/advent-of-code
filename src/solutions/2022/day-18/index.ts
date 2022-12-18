import { AdvancedSet } from 'lib/advanced-set';
import { Coordinates3D } from 'lib/helper';
import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

  cubes = new AdvancedSet<Coordinates3D>();

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
    this.cubes.addRange(
      this.lines.map((l) => {
        const [x, y, z] = l.split(',').map(Number);
        return new Coordinates3D(x, y, z);
      })
    );
  }

  private getTotalSurfaceArea(
    analysedCubes: AdvancedSet<Coordinates3D>
  ): number {
    let surface = 0;

    for (let cube of analysedCubes) {
      let exposedSides = 6;
      for (let i = -1; i <= 1; i += 2) {
        const { offsetX, offsetY, offsetZ } = this.getOffsetCubes(cube, i);

        if (analysedCubes.has(offsetX)) exposedSides--;
        if (analysedCubes.has(offsetY)) exposedSides--;
        if (analysedCubes.has(offsetZ)) exposedSides--;
      }
      surface += exposedSides;
    }

    return surface;
  }

  private getOffsetCubes(
    cube: Coordinates3D,
    offset: number
  ): {
    offsetX: Coordinates3D;
    offsetY: Coordinates3D;
    offsetZ: Coordinates3D;
  } {
    return {
      offsetX: new Coordinates3D(cube.x + offset, cube.y, cube.z),
      offsetY: new Coordinates3D(cube.x, cube.y + offset, cube.z),
      offsetZ: new Coordinates3D(cube.x, cube.y, cube.z + offset),
    };
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);

    const result = this.getTotalSurfaceArea(this.cubes);
    logger.result(result);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    const { min, max } = this.getMinMaxCubes();
    const allAirCubes: AdvancedSet<Coordinates3D> =
      this.getAllAirCubesInDroplet(min, max);

    //BFS Check all cubes and keep only the ones that are surrounded (AirPockets)
    let stack: Coordinates3D[] = [min];
    let visited = new AdvancedSet<Coordinates3D>();
    while (stack.length) {
      let v = stack.pop();
      visited.add(v);
      allAirCubes.delete(v);
      for (let i = -1; i <= 1; i += 2) {
        const { offsetX, offsetY, offsetZ } = this.getOffsetCubes(v, i);

        if (allAirCubes.has(offsetX) && !visited.has(offsetX))
          stack.push(offsetX);
        if (allAirCubes.has(offsetY) && !visited.has(offsetY))
          stack.push(offsetY);
        if (allAirCubes.has(offsetZ) && !visited.has(offsetZ))
          stack.push(offsetZ);
      }
    }

    //Get the surface
    logger.result(
      this.getTotalSurfaceArea(new AdvancedSet([...this.cubes, ...allAirCubes]))
    );
  }

  private getAllAirCubesInDroplet(
    min: Coordinates3D,
    max: Coordinates3D
  ): AdvancedSet<Coordinates3D> {
    let allAirCubes = new AdvancedSet<Coordinates3D>();

    for (let x = min.x; x < max.x; x++) {
      for (let y = min.y; y < max.y; y++) {
        for (let z = min.z; z < max.z; z++) {
          const coord = new Coordinates3D(x, y, z);
          if (!this.cubes.has(coord)) {
            allAirCubes.add(coord);
          }
        }
      }
    }

    return allAirCubes;
  }

  private getMinMaxCubes(): { min: Coordinates3D; max: Coordinates3D } {
    const { minX, minY, minZ, maxX, maxY, maxZ } = Array.from(
      this.cubes
    ).reduce(
      (acc, cur) => {
        return {
          minX: Math.min(acc.minX, cur.x - 1),
          minY: Math.min(acc.minY, cur.y - 1),
          minZ: Math.min(acc.minZ, cur.z - 1),
          maxX: Math.max(acc.maxX, cur.x + 1),
          maxY: Math.max(acc.maxY, cur.y + 1),
          maxZ: Math.max(acc.maxZ, cur.z + 1),
        };
      },
      {
        minX: Number.MAX_SAFE_INTEGER,
        minY: Number.MAX_SAFE_INTEGER,
        minZ: Number.MAX_SAFE_INTEGER,
        maxX: Number.MIN_SAFE_INTEGER,
        maxY: Number.MIN_SAFE_INTEGER,
        maxZ: Number.MIN_SAFE_INTEGER,
      }
    );

    return {
      min: new Coordinates3D(minX, minY, minZ),
      max: new Coordinates3D(maxX, maxY, maxZ),
    };
  }
}

const year = '2022';
const day = '18';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
