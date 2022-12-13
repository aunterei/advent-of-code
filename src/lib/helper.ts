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

export type Coordinates = [number, number];

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
  [x, y]: Coordinates,
  searchMap: T[][],
  withinBound = true
): Coordinates[] {
  return [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ]
    .map(([dx, dy]) => [x + dx, y + dy] as Coordinates)
    .filter(([x, y]) => {
      let condition = x >= 0 && y >= 0;
      if (withinBound) {
        condition =
          condition && x < searchMap[0].length && y < searchMap.length;
      }
      return condition;
    });
}

export function getCellValue<T>(map: T[][], coord: Coordinates): T {
  const [x, y] = coord;
  return map[y][x];
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
    endNode: { coord: [-1, -1], weight: Number.MAX_SAFE_INTEGER },
  };
}

export function areCoordinatesEqual(a: Coordinates, b: Coordinates) {
  const [aX, aY] = a;
  const [bX, bY] = b;
  return aX === bX && aY === bY;
}
//#endregion
