import { Coordinates } from './helper';
require('google-closure-library');
//@ts-ignore
goog.require('goog.structs');
//@ts-ignore
goog.require('goog.structs.PriorityQueue');

export interface Vertex {
  cost: number;
  costFromStart: number;
  prevNode: Coordinates;
}

export class Dijkstra {
  vertices: any;

  constructor() {
    this.vertices = [];
  }

  addVertex(vertex: Vertex, yIndex: number): void {
    this.vertices[yIndex].push(vertex);
  }

  public parseMap(map: number[][]): void {
    let height = map.length;
    let width = map[0].length;

    for (let y = 0; y < height; ++y) {
      this.vertices.push([]);

      for (let x = 0; x < width; ++x) {
        this.addVertex(
          {
            cost: map[y][x],
            costFromStart: Number.MAX_SAFE_INTEGER,
            prevNode: { x: 0, y: 0 },
          },
          y
        );
      }
    }
  }

  public getEndPointCostFromStart(endCoordinates: Coordinates) {
    //@ts-ignore
    let unvisited = new goog.structs.PriorityQueue();

    unvisited.enqueue(0, {
      x: 0,
      y: 0,
    });
    this.vertices[0][0].costFromStart = 0;

    let tryAddNextPathNode = (x_off, y_off, prevNodeXY) => {
      // Check if visiting this node is allowed
      let x = prevNodeXY.x + x_off;
      let y = prevNodeXY.y + y_off;
      if (x < 0 || x >= this.vertices[0].length) {
        return;
      }
      if (y < 0 || y >= this.vertices.length) {
        return;
      }

      let node = this.vertices[y][x];

      // Check if it was already visited
      if (node.costFromStart !== Number.MAX_SAFE_INTEGER) return;

      let prevNode = this.vertices[prevNodeXY.y][prevNodeXY.x];

      // Check if distance to this node is of lower cost than before
      let newCost = node.cost + prevNode.costFromStart;
      if (newCost < node.costFromStart) {
        node.costFromStart = newCost;
        node.prevNode = prevNodeXY;
      }

      // Add new candidate
      unvisited.enqueue(node.costFromStart, {
        x: x,
        y: y,
      });
    };

    while (!unvisited.isEmpty()) {
      let nod = unvisited.dequeue();

      tryAddNextPathNode(0, -1, nod);
      tryAddNextPathNode(-1, 0, nod);
      tryAddNextPathNode(1, 0, nod);
      tryAddNextPathNode(0, 1, nod);
    }
    return this.vertices[endCoordinates.y][endCoordinates.x].costFromStart;
  }
}
