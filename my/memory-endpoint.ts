import * as rx from './urxjs';
import RxEndpoint from './rx-endpoint';
import PayloadParser from './payload-parser';

export function MemoryEndpoint(serviceMap: Map<string, rx.Subject<any>[]>): RxEndpoint {
    return new RxEndpoint()
        .send((data: any, rxs: rx.Subject<any>) => {
            /* */
        })
        .recv((data: any, rxs: rx.Subject<any>) => {
            /* */
        });
}

export default MemoryEndpoint;

//     public listen(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
//         if (this.serviceMap.has(param.channelName)) {
//             cb(null);
//             return;
//         }
//         this.serviceMap.set(param.channelName, [endpoint]);
//         cb(endpoint);

//     }

//     public connect(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
//         const map = this.serviceMap.get(param.channelName);
//         if (!map) {
//             cb(null);
//             return;
//         }
//         if (map.length != 1) {
//             cb(null);
//             return;
//         }
//         map.push(endpoint);
//         cb(endpoint);

//     }

//     public close(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {

//         this.serviceMap.delete(param.channelName);
//         cb(endpoint);

//     }

//     public read(data: any, param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {

//         const endpointToSendTo = this.serviceMap.get(param.channelName).find((i) => endpoint !== i);

//         if (!endpointToSendTo) {
//             cb(null);
//             return;
//         }

//         endpointToSendTo.bounded.forEach( bound => bound(data) );

//         cb(endpoint);

//     }
// }
