import { Logger } from 'lib/log';
import { parseFile, parseLine } from 'lib/parser';

interface File {
  name: string;
  size: number;
}

class Directory {
  public name: string;

  public parentDir?: Directory;

  public childrenDir: Directory[];

  public files: File[];

  public getDirectorySize(): number {
    return (
      this.files.reduce((acc, cur) => acc + cur.size, 0) +
      this.childrenDir.reduce((acc, cur) => acc + cur.getDirectorySize(), 0)
    );
  }

  constructor(name: string, parent?: Directory) {
    this.name = name;
    this.parentDir = parent;
    this.childrenDir = [];
    this.files = [];
  }
}

class Resolver {
  year: string;
  day: string;
  file: string;
  lines: string[];

  baseDirectory: Directory = new Directory('/', null);
  currentDirectory: Directory = this.baseDirectory;

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

    //Skipping first line that goes to baseDirectory
    this.lines = this.file.split('\n').slice(1, this.file.length);

    this.parseDirectories(this.lines);
  }

  private parseDirectories(data: string[]): void {
    data.forEach((line) => {
      const output = line.split(' ');

      switch (output[0]) {
        //Command
        case '$':
          //Navigate
          if (output[1] === 'cd') {
            output[2] === '..'
              ? (this.currentDirectory = this.currentDirectory.parentDir)
              : (this.currentDirectory = this.addChildrenIfNotExist(
                  output[2],
                  this.currentDirectory
                ));
          }
          break;
        //Listing directory
        case 'dir':
          this.addChildrenIfNotExist(output[1], this.currentDirectory);
          break;
        //Listing File
        default:
          this.currentDirectory.files.push({
            name: output[1],
            size: +output[0],
          });
          break;
      }
    });
  }

  private addChildrenIfNotExist(
    childrenName: string,
    parent: Directory
  ): Directory {
    let childrenDir = parent.childrenDir.find((c) => c.name === childrenName);
    if (!childrenDir) {
      childrenDir = new Directory(childrenName, parent);
      parent.childrenDir.push(childrenDir);
    }
    return childrenDir;
  }

  solve1() {
    const logger = new Logger(`Day${this.day}-1`);
    const result = this.getFirstPartSize(this.baseDirectory);
    logger.result(result);
  }

  private getFirstPartSize(current: Directory): number {
    let size = 0;

    for (let child of current.childrenDir) {
      size += this.getFirstPartSize(child);
    }

    size =
      current.getDirectorySize() < 100000
        ? size + current.getDirectorySize()
        : size;

    return size;
  }

  solve2() {
    const logger = new Logger(`Day${this.day}-2`);

    const deletableFolders = this.getDeletableFolders(this.baseDirectory);
    const result = Math.min(
      ...deletableFolders.map((f) => f.getDirectorySize())
    );

    logger.result(result);
  }

  private getDeletableFolders(directory: Directory): Directory[] {
    const unusedSpace = 70000000 - this.baseDirectory.getDirectorySize();
    const spaceNeeded = 30000000 - unusedSpace;
    let deletableFolders: Directory[] = [];

    if (directory.getDirectorySize() >= spaceNeeded) {
      deletableFolders.push(directory);
    }

    for (let child of directory.childrenDir) {
      deletableFolders = [
        ...deletableFolders,
        ...this.getDeletableFolders(child),
      ];
    }

    return deletableFolders;
  }
}

const year = '2022';
const day = '7';
const testing = false;

const resolver = new Resolver({ year, day, testing });
resolver.solve1();
// resolver.solve2();
