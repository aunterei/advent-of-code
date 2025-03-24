import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';
import { cloneDeep } from 'lodash';

// Directions
enum D {
  Right,
  Down,
  Left,
  Up,
}

// Rotations
enum R {
  I, // Identity
  R, // Rotate 90 CW
  H, // Rotate 180
  L, // Rotate 90 CCW
}

function rotD(f: D, r: R) {
  return (f + r) % 4;
}

function move(x: number, y: number, f: D) {
  switch (f) {
    case D.Right:
      return [x, y + 1];
    case D.Down:
      return [x + 1, y];
    case D.Left:
      return [x, y - 1];
    case D.Up:
      return [x - 1, y];
  }
}

function mod(x: number, m: number) {
  x %= m;
  if (x < 0) x += m;
  return x;
}

interface Problem {
  // `2d face name,direction` -> [new map face name, rotation]
  transitions: Map<string, [string, R]>;
  // cube edge width, faces are M x M
  M: number;
  // original map with dimensions
  map: string[];
  xMax: number;
  yMax: number;
}

// Description of a face using 3d vertices in {0,1}^3 coordinates.
// {0,1}^3 coordinates are represented as numbers b000(0) to b111(7).
interface Face {
  tl: number;
  tr: number;
  bl: number;
  br: number;
}

const COORDS: { [bits: number]: string } = { 0: 'x', 2: 'y', 4: 'z' };
function faceName3d(face: Face): string {
  let mask = 1;
  while (mask < 8) {
    let seen = new Set<number>();
    seen.add(mask & face.tl);
    seen.add(mask & face.tr);
    seen.add(mask & face.bl);
    seen.add(mask & face.br);

    // two dimensions will see both 0 and 1, the third will see only one.
    if (seen.size === 1) {
      return `${COORDS[mask]} = ${[...seen][0] ? 1 : 0}`;
    }
    mask = mask << 1;
  }
  throw new Error('faceName3d: no mask found');
}

/**
 * The most magical function in the program. Given the 4 verices of a face, using numbers b000(0) to b111(7)
 * we can use bit operations to get the 4 vertices of any adjacent face in direction d.
 *
 * The general observation is that any vertex plus its three neighbors add up to b111(7) in F2^3 arithmetic.
 *
 * When moving to an adjecent face, 2 of the vertices are relabeling of the original ones,
 * and the other 2 can be computed using the above observation.
 */
function transitionFaceIn3d(face: Face, d: D): Face {
  switch (d) {
    case D.Right:
      return {
        tl: face.tr,
        bl: face.br,
        tr: 7 ^ face.tr ^ face.tl ^ face.br,
        br: 7 ^ face.br ^ face.bl ^ face.tr,
      };
    case D.Left:
      // swap r and l from above.
      return {
        tr: face.tl,
        br: face.bl,
        tl: 7 ^ face.tl ^ face.tr ^ face.bl,
        bl: 7 ^ face.bl ^ face.br ^ face.tl,
      };
    case D.Down:
      return {
        tl: face.bl,
        tr: face.br,
        bl: 7 ^ face.bl ^ face.tl ^ face.br,
        br: 7 ^ face.br ^ face.tr ^ face.bl,
      };
    case D.Up:
      // swap u and d from above.
      return {
        bl: face.tl,
        br: face.tr,
        tl: 7 ^ face.tl ^ face.bl ^ face.tr,
        tr: 7 ^ face.tr ^ face.br ^ face.tl,
      };
  }
}

// assuming we are passing two different orientations of the same face
// find the rotation to get face to otherFace.
function getRfromFace(face: Face, otherFace: Face): R {
  if (face.tl === otherFace.tl) return R.I;
  if (face.tl === otherFace.tr) return R.R;
  if (face.tl === otherFace.bl) return R.L;
  if (face.tl === otherFace.br) return R.H;
  throw new Error(
    `should not happen ${face.tl} ${otherFace}. Did you check sameFace?`
  );
}

function makeProb(map: string[]): Problem {
  let c = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] !== ' ') c++;
    }
  }
  const M = Math.sqrt(c / 6);
  // find top left corner of each cube on the map
  // use `${i},${j}` as the canonical 2d map face name.
  let facesMapCoords = new Set<string>();
  for (let i = 0; i < map.length / M; i++) {
    for (let j = 0; j < map[i].length / M; j++) {
      if (map[i * M][j * M] !== ' ') {
        facesMapCoords.add(`${i},${j}`);
      }
    }
  }
  // 2d face name -> 3d face vertices
  let charts: Map<string, Face> = new Map();

  // bfs accross the map to assign the six faces.
  const q: { coord: string; face: Face }[] = [];
  let map3dto2dnames = new Map<string, string>();
  // pick a random face to start with and randomly assign it the 000,001,011,010 3D vertices.
  q.push({
    coord: [...facesMapCoords.keys()][0],
    face: { tl: 0, tr: 1, br: 3, bl: 2 },
  });
  while (q.length > 0) {
    let { coord, face } = q.shift()!;
    let [x, y] = coord.split(',').map((x) => parseInt(x));
    if (charts.has(coord)) continue;
    for (let d of [D.Right, D.Down, D.Left, D.Up]) {
      let [nx, ny] = move(x, y, d);
      let h = `${nx},${ny}`;
      if (facesMapCoords.has(h)) {
        q.push({ coord: h, face: transitionFaceIn3d(face, d) });
      } // else we will compute this transition later, once we have all map transitions.
    }
    charts.set(coord, face);
    map3dto2dnames.set(faceName3d(face), coord);
  }

  // compute all face and direction to new face transitions
  let transitions = new Map<string, [string, R]>();
  for (let [coord, face] of charts) {
    for (let d of [D.Right, D.Down, D.Left, D.Up]) {
      let newFace = transitionFaceIn3d(face, d);
      let new3dFaceName = faceName3d(newFace);
      let new2dFaceName = map3dto2dnames.get(new3dFaceName)!;
      let rot = getRfromFace(newFace, charts.get(new2dFaceName)!);
      transitions.set(`${coord},${d}`, [new2dFaceName, rot]);
    }
  }
  return { map, xMax: map.length, yMax: map[0].length, transitions, M };
}

// rotate coordinates within a square M x M cube face
function rotate([x, y]: [number, number], rot: R, M: number) {
  switch (rot) {
    case R.I:
      return [x, y];
    case R.R:
      return [y, M - 1 - x];
    case R.L:
      return [M - 1 - y, x];
    case R.H:
      return [M - 1 - x, M - 1 - y];
  }
}

// large coordinates are the coordinates of the M x M cube faces.
// small coordinates are the coordinates within the M x M cube face.
function splitToLargeAndSmallCoords(x: number, y: number, M: number) {
  let lx = Math.floor(x / M),
    ly = Math.floor(y / M);
  let sx = mod(x, M),
    sy = mod(y, M);
  return [lx, ly, sx, sy];
}

function combineLargeAndSmallCoords(
  lx: number,
  ly: number,
  sx: number,
  sy: number,
  M: number
): [number, number] {
  return [lx * M + sx, ly * M + sy];
}

type State = [number, number, D];
type MoveFn = (pos: State, p: Problem) => State;

// part 1
function moveOnMap([x, y, d]: State, p: Problem): State {
  let rx = x,
    ry = y;
  do {
    [rx, ry] = move(rx, ry, d);
    rx = mod(rx, p.xMax);
    ry = mod(ry, p.yMax);
    // keep going until we reach ground again
  } while (p.map[rx][ry] === ' ');
  return [rx, ry, d];
}

// part 2
function moveOnCube([x, y, d]: State, p: Problem): State {
  let [lx, ly, sx, sy] = splitToLargeAndSmallCoords(x, y, p.M);
  // naive move in small coords to see where we land.
  let [rx, ry] = move(sx, sy, d);
  // if within the same cube face, return raw coordinates
  if (rx >= 0 && ry >= 0 && rx < p.M && ry < p.M) {
    return [lx * p.M + rx, ly * p.M + ry, d];
  }
  // a face transition has occured
  let startCube2dFaceName = `${lx},${ly}`;
  let [newCube, rot] = p.transitions.get(`${startCube2dFaceName},${d}`)!;
  // new large coords
  let [nlx, nly] = newCube.split(',').map((x) => parseInt(x));
  // mod new small coords to be within a cube face
  let nsx = mod(rx, p.M);
  let nsy = mod(ry, p.M);
  // update small coords with rotation
  [nsx, nsy] = rotate([nsx, nsy], rot, p.M);
  // compute new direction
  const newDir = rotD(d, rot);
  return [...combineLargeAndSmallCoords(nlx, nly, nsx, nsy, p.M), newDir];
}

function walk(
  x: number,
  y: number,
  d: D,
  inst: string[],
  p: Problem,
  moveF: MoveFn
) {
  for (let i of inst!) {
    if (i === 'L' || i === 'R') {
      d = rotD(d, i === 'L' ? R.L : R.R);
    } else {
      let n = parseInt(i);
      for (let j = 0; j < n; j++) {
        let res = moveF([x, y, d], p);
        if (p.map[res[0]][res[1]] === '#') break;
        [x, y, d] = res;
      }
    }
  }
  return [x, y, d];
}

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

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
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    let i = 0,
      p1 = 0,
      p2 = 0,
      pcount = 1;
    while (i < this.lines.length) {
      let grid = [];
      while (this.lines[i] !== '' && i < this.lines.length) {
        grid.push(this.lines[i]);
        i++;
      }
      if (grid.length === 0) break;
      i++; // empty line
      const pass = this.lines[i++];

      // setup map
      const maxL = grid.reduce((acc, line) => Math.max(acc, line.length), 0);
      grid = grid.map((line) => line.padEnd(maxL, ' '));

      const inst = pass?.split(/([RL])/)!;
      let x = 0;
      let y = 0;
      let d = D.Right;
      while (grid[x][y] === ' ') {
        y++;
      }
      let p = makeProb(grid);
      let [xf, yf, ff] = walk(x, y, d, inst, p, moveOnMap);
      let ans1 = 1000 * (xf + 1) + 4 * (yf + 1) + ff;
      p1 += ans1;
      console.log(`problem ${pcount}: flat ${ans1}`);

      [xf, yf, ff] = walk(x, y, d, inst, p, moveOnCube);
      let ans2 = 1000 * (xf + 1) + 4 * (yf + 1) + ff;
      p2 += ans2;
      console.log(`problem ${pcount}: cube ${ans2}`);
      console.log();
      i += 1; // empty line
      pcount += 1;
    }

    logger.result(p1);
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);
    let i = 0,
      p1 = 0,
      p2 = 0,
      pcount = 1;
    while (i < this.lines.length) {
      let grid = [];
      while (this.lines[i] !== '' && i < this.lines.length) {
        grid.push(this.lines[i]);
        i++;
      }
      if (grid.length === 0) break;
      i++; // empty line
      const pass = this.lines[i++];

      // setup map
      const maxL = grid.reduce((acc, line) => Math.max(acc, line.length), 0);
      grid = grid.map((line) => line.padEnd(maxL, ' '));

      const inst = pass?.split(/([RL])/)!;
      let x = 0;
      let y = 0;
      let d = D.Right;
      while (grid[x][y] === ' ') {
        y++;
      }
      let p = makeProb(grid);
      let [xf, yf, ff] = walk(x, y, d, inst, p, moveOnMap);
      let ans1 = 1000 * (xf + 1) + 4 * (yf + 1) + ff;
      p1 += ans1;
      console.log(`problem ${pcount}: flat ${ans1}`);

      [xf, yf, ff] = walk(x, y, d, inst, p, moveOnCube);
      let ans2 = 1000 * (xf + 1) + 4 * (yf + 1) + ff;
      p2 += ans2;
      console.log(`problem ${pcount}: cube ${ans2}`);
      console.log();
      i += 1; // empty line
      pcount += 1;
    }

    logger.result(p2);
  }

  // printMap(map: Map | any, player?: Position, facing?: Facing): void {
  //   if (player) {
  //     const f = ['👉', '🔻', '👈', '👆'];
  //     map = cloneDeep(map);
  //     map[player.y][player.x] = f[facing];
  //   }

  //   console.log(
  //     map
  //       .map((row) => row.join(''))
  //       .join('\n')
  //       .replace(/ /g, '⬛')
  //       .replace(/\./g, '⬜')
  //       .replace(/#/g, '🟧')
  //       .replace(/P/g, '❎')

  //     // 🟥🟧🟨🟩🟦🟪🟫⬛⬜🔲⏹❎
  //   );
  //   console.log('');
  // }
}

const year = '2022';
const day = '22';
const testing = false;

const resolver = new Resolver({ year, day, testing });
// resolver.solve1();
resolver.solve2();
