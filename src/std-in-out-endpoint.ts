
import * as rx from './urxjs';
import PayloadParser from './payload-parser';

export class StdInOutEndpoint {
  public input: rx.Observable<string>;
  public output: rx.Subject<string>;

  constructor() {
    this.input = rx.Observable.create((observer: rx.Observer<string>) => {
      process.stdin.on('data', stuff => {
        // console.log('got:', stuff);
        observer.next(stuff.toString('utf-8'));
      });
      process.stdin.on('error', (error: any) => {
        observer.error(error);
      });
      process.stdin.on('close', () => {
        // console.log('close:');
        observer.complete();
        process.exit(0);
      });
    });
    this.output = new rx.Subject();
    this.output.subscribe((a) => process.stdout.write(a));
  }
}

export default StdInOutEndpoint;
