// import * as rx from 'rxjs';
import * as rx from './urxjs';

import FirstLastEndpoint from './first-last-endpoint';
import DebugEndpoint from './debug-endpoint';

interface DataRxs {
  (data: any, next: rx.Subject<any>): void;
}

function passThru(data: any, rxs: rx.Subject<any>): void {
  if (rxs) {
    rxs.next(data);
  }
}

export class RxEndpoint {
  public rxSend: rx.Subject<any>;
  public rxStackSend: rx.Subject<any>;
  public sendFn: DataRxs;

  public rxRecv: rx.Subject<any>;
  public rxStackRecv: rx.Subject<any>;
  public recvFn: DataRxs;

  constructor() {
    // console.log('RxEndpoint');
    this.rxRecv = new rx.Subject();
    this.recvFn = passThru;
    this.rxRecv.subscribe((data: any) => {
      // console.log('rxRecv:', data);
      this.recvFn(data, this.rxStackRecv);
    });

    this.rxSend = new rx.Subject();
    this.sendFn = passThru;
    this.rxSend.subscribe((data: any) => {
      // console.log('rxSend:', data);
      this.sendFn(data, this.rxStackSend);
    });
  }

  public send(fn: DataRxs): RxEndpoint {
    this.sendFn = fn;
    return this;
  }

  public recv(fn: DataRxs): RxEndpoint {
    this.recvFn = fn;
    return this;
  }

  public stack(rxs: RxEndpoint): RxEndpoint {
    rxs.rxStackRecv = this.rxRecv;
    this.rxStackSend = rxs.rxSend;
    // console.log(rxs);
    return rxs;
  }

}

export default RxEndpoint;

// const rx0 = new RxEndpoint().recv((data, rxs) => {
//   rx0.rxSend.next(data);
// });

// const flep = FirstLastEndpoint('__BEG__', '__END__');
// const dep = DebugEndpoint();

// const rx2 = new RxEndpoint();
// rx2.send((data: any, rxs) => {
//   console.log('RX2:', data);
// });

// rx0.stack(dep).stack(flep).stack(rx2);

// rx2.rxRecv.next('recv-0');
// rx2.rxRecv.next('recv-1');
