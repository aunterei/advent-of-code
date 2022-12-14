export function sumOfFirst(number: number): number {
  return (number * (number + 1)) / 2;
}

export function isOneOf(value: any, tests: any[]): boolean {
  return tests.reduce((acc, test) => acc || value === test, false);
}

export function groupBy(objects: any[], key: string): any {
  return objects.reduce((acc, obj) => {
    if (!acc[obj[key]]) {
      acc[obj[key]] = [];
    }
    acc[obj[key]].push(obj);
    return acc;
  }, {});
}

export function matchAllCharacters(string1: string, string2: string): boolean {
  return string2.split('').every((char2) => string1.includes(char2));
}

export function removeElement(array: any[], element: any): void {
  const i = array.indexOf(element);
  if (i !== -1) {
    array.splice(i, 1);
  }
}

export function reverseMap(map: object): object {
  return Object.entries(map).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
}

export function sortStringKeys(map: object): object {
  return Object.entries(map).reduce((acc, [key, value]) => {
    acc[sortCharacters(key)] = value;
    return acc;
  }, {});
}

export function sortCharacters(str: string): string {
  return str.split('').sort().join('');
}

export function isValidBoardDirection(
  board: any[][],
  point: { x: number; y: number },
  dir: { x: number; y: number }
): boolean {
  const newX = point.x + dir.x;
  const newY = point.y + dir.y;
  return (
    newX >= 0 && newX < board[0].length && newY >= 0 && newY < board.length
  );
}

export function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

export function commonElementInTwoArrays<T>(
  firstArray: T[],
  secondArray: T[]
): T {
  const commonElements = firstArray.filter((firstElement) =>
    secondArray.some((secondElement) => firstElement === secondElement)
  );
  return commonElements.length ? commonElements[0] : null;
}

export function commonElementInMultipleArrays<T>(group: T[][]): T {
  const commonElements = group.reduce((a, b) => a.filter((c) => b.includes(c)));
  return commonElements.length ? commonElements[0] : null;
}

//#region BFS

export class Coordinates extends Object {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  public override toString(): string {
    return `[${this.x},${this.y}]`;
  }
}

export type neighborFilteringCondition = (
  current: Coordinates,
  neighbor: Coordinates
) => boolean;

interface BfsResult {
  visited: Node[];
  endNode: Node;
}

interface Node {
  coord: Coordinates;
  weight: number;
}

export function getCartesianNeighbors<T>(
  current: Coordinates,
  searchMap: T[][],
  withinBound = true
): Coordinates[] {
  return [
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ]
    .map((offset) => {
      const coordinates: Coordinates = {
        x: current.x + offset.x,
        y: current.y + offset.y,
      };
      return coordinates;
    })
    .filter((coord) => {
      let condition = coord.x >= 0 && coord.y >= 0;
      if (withinBound) {
        condition =
          condition &&
          coord.x < searchMap[0].length &&
          coord.y < searchMap.length;
      }
      return condition;
    });
}

export function getCellValue<T>(map: T[][], coord: Coordinates): T {
  return map[coord.y][coord.x];
}

export function bfs(
  start: Coordinates,
  endCondition: (coordinates: Coordinates) => boolean,
  getNextCoordinates: (coordinates: Coordinates) => Coordinates[]
): BfsResult {
  if (!start || !endCondition || !getNextCoordinates) {
    return;
  }

  const queue: Node[] = [{ coord: start, weight: 0 }];
  const visited: Node[] = [];

  while (queue.length) {
    const current = queue.shift();
    const { coord, weight } = current;

    // Don't revisit a coordinate
    if (
      visited.findIndex((visited) =>
        areCoordinatesEqual(coord, visited.coord)
      ) !== -1
    ) {
      continue;
    }

    visited.push(current);

    if (endCondition(current.coord)) {
      return { visited: visited, endNode: current };
    }

    for (let node of getNextCoordinates(current.coord).map((neighborCoord) => {
      return { coord: neighborCoord, weight: weight + 1 } as Node;
    })) {
      queue.push(node);
    }
  }

  return {
    visited: visited,
    endNode: { coord: { x: -1, y: -1 }, weight: Number.MAX_SAFE_INTEGER },
  };
}

export function areCoordinatesEqual(a: Coordinates, b: Coordinates) {
  return a.x === b.x && a.y === b.y;
}

export class CoordinatesSet extends Set<Coordinates> {
  private readonly keyMap: Map<string, Coordinates> = new Map();

  private key(value: Coordinates): string {
    return value.toString();
  }

  public push(x: number, y: number) {
    return this.add(new Coordinates(x, y));
  }

  override add(value: Coordinates): this {
    const key = this.key(value);

    const old = this.keyMap.get(key);
    if (old) {
      this.delete(old);
    }
    this.keyMap.set(key, value);
    super.add(value);
    return this;
  }

  override clear(): void {
    this.keyMap.clear();
    super.clear();
  }

  override delete(value: Coordinates): boolean {
    const key = this.key(value);
    const old = this.keyMap.get(key);
    if (old) {
      this.keyMap.delete(key);
      return super.delete(old);
    }
    return false;
  }

  public hadCoordinates(x: number, y: number): boolean {
    return this.has(new Coordinates(x, y));
  }

  override has(value: Coordinates): boolean {
    return this.keyMap.has(this.key(value));
  }
}
//#endregion
