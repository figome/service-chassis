import * as rx from './urxjs';
import RxEndpoint from './rx-endpoint';
import PayloadParser from './payload-parser';
import * as stream from 'stream';
import { spawn, ChildProcess } from 'child_process';

export class ExecEndpoint extends RxEndpoint {
  private subProcess: ChildProcess;
  constructor() {
    super();
  }
  public command(command: string, argv: string[] = [], killTimeout = 500): void {
    this.subProcess = spawn(command, argv);
    const errorStack: any[] = [];
    this.subProcess.stdout.on('data', (_data) => {
      // console.log('STDIN:', _data);
      this.rxRecv.next((_data as Buffer).toString('utf-8'));
    });
    this.rxSend.subscribe(null, null, () => {
      this.subProcess.stdin.end(() => {
        setTimeout(() => {
          this.subProcess.kill();
        }, killTimeout);
      });
    });
    this.subProcess.on('close', (status, signal) => {
      if (status != 0) {
        this.rxSend.error(errorStack.concat({ status: status, signal: signal }));
        this.rxRecv.error(errorStack.concat({ status: status, signal: signal }));
      } else if (errorStack.length) {
        this.rxSend.error(errorStack);
        this.rxRecv.error(errorStack);
      }
      this.rxSend.complete();
      this.rxRecv.complete();
    });
    this.subProcess.on('error', (_data: any) => {
      errorStack.push(_data);
    });
  }
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
