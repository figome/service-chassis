
interface DataCallback {
  (data: any): void;
}
export class Subject<T> {
  private subscribes: DataCallback[];

  constructor() {
    this.subscribes = [];
  }

  public next(data: any): void {
    this.subscribes.forEach(cb => cb(data));
  }
  public subscribe(cb: (data: any) => void): void {
    this.subscribes.push(cb);
  }
}
