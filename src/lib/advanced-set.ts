export class AdvancedSet<T> extends Set<T> {
  private readonly keyMap: Map<string, T> = new Map();

  private getKey: (value: T) => string;

  constructor(values?: T[], getKeyMethod?: (value: T) => string) {
    super();
    if (!getKeyMethod) {
      getKeyMethod = (v: T) => v.toString();
    }
    this.getKey = getKeyMethod;

    if (values) {
      this.addRange(values);
    }
  }

  public addRange(array: T[]): void {
    for (let value of array) {
      this.add(value);
    }
  }

  public get(value: T): T {
    return this.keyMap.get(this.getKey(value));
  }

  override add(value: T): this {
    const key = this.getKey(value);

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

  override delete(value: T): boolean {
    const key = this.getKey(value);
    const old = this.keyMap.get(key);
    if (old) {
      this.keyMap.delete(key);
      return super.delete(old);
    }
    return false;
  }

  override has(value: T): boolean {
    return this.keyMap.has(this.getKey(value));
  }

  public hasRange(array: T[]): boolean {
    let has = true;
    for (let value of array) {
      has &&= this.has(value);
    }
    return has;
  }

  public hasOneOfRange(array: T[]): boolean {
    for (let value of array) {
      if (this.has(value)) return true;
    }
    return false;
  }
}
