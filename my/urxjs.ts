
interface DataCallback {
  (data: any): void;
}

interface CompletesCallback {
  (): void;
}

export class Subject<T> {
  private subscribes: DataCallback[];
  private completes: CompletesCallback[];
  private errors: DataCallback[];

  constructor() {
    this.subscribes = [];
    this.completes = [];
    this.errors = [];
  }
  public complete(): void {
    this.completes.forEach(cb => cb());
  }
  public next(data: any): void {
    this.subscribes.forEach(cb => cb(data));
  }
  public error(data: any): void {
    this.errors.forEach(cb => cb(data));
  }
  public subscribe(cb: (data: any) => void,
    error?: (data: any) => void,
    complete?: () => void): void {
    if (cb) { this.subscribes.push(cb); }
    if (error) { this.errors.push(error); }
    if (complete) { this.completes.push(complete); }
  }
}
