import * as rx from './urxjs';
import RxEndpoint from './rx-endpoint';
import PayloadParser from './payload-parser';
import * as stream from 'stream';
import { spawn, ChildProcess } from 'child_process';

export function ExecEndpoint(command: string, argv: string[] = [], killTimeout = 500): RxEndpoint {
  let subProcess: ChildProcess = spawn(command, argv);

  return new RxEndpoint()
    .send((data: any, rxs: rx.Subject<any>) => {
      subProcess.stdout.on('data', (_data) => {
        rxs.next(_data);
      });
      subProcess.on('close', (status, signal) => {
        // rxs.complete();
        // endpoint.bounded.forEach(bound => bound(null, status, signal));
      });
      subProcess.on('error', (_data: any) => {
        // endpoint.boundedError.forEach(bound => bound(data));
     });
    })
    .recv((data: any, rxs: rx.Subject<any>) => {
      subProcess.stdin.write(data, () => {
        rxs.next(data);
      });
    });
}

export default ExecEndpoint;

  // public close(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {

  //   this.toSubProcess.end(() => {
  //     setTimeout(() => {

  //       this.subProcess.kill();
  //       cb(endpoint);

  //     }, this.killTimeout);
  //   });

  // }
