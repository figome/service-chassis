
import * as rx from './urxjs';
import RxEndpoint from './rx-endpoint';
import PayloadParser from './payload-parser';

export function StdInOutEndpoint(): RxEndpoint {
  const rxe = new RxEndpoint()
    .recv((_: any, rxs: rx.Subject<any>) => {
      // console.log('receive:', _);
      process.stdout.write(_.toString());
      // rxs.next(_);
    });

  process.stdin.on('data', stuff => {
    rxe.rxRecv.next(stuff);
  });
  process.stdin.on('close', () => {
    process.exit(47);
  });
  return rxe;
}

export default StdInOutEndpoint;
