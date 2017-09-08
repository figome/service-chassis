
import * as rx from './urxjs';
import RxEndpoint from './rx-endpoint';
import PayloadParser from './payload-parser';

export function DebugEndpoint(): RxEndpoint {
    return new RxEndpoint()
        .send((data: any, rxs: rx.Subject<any>) => {
            console.log(`[>:${data}]`);
            rxs.next(data);
        })
        .recv((data: any, rxs: rx.Subject<any>) => {
            console.log(`[<:${data}]`);
            rxs.next(data);
        });
}

export default DebugEndpoint;
