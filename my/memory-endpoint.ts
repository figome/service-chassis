import * as rx from './urxjs';
import RxEndpoint from './rx-endpoint';
import PayloadParser from './payload-parser';

export class MemoryEndpoint {
    private serviceMap: Map<string, RxEndpoint[]>;

    constructor() {
        this.serviceMap = new Map<string, RxEndpoint[]>();
    }

    public listen(cname: string): RxEndpoint {
        if (this.serviceMap.has(cname)) {
            return null;
        }
        const partners: RxEndpoint[] = [];
        const ret = new RxEndpoint()
            .send((data: any, rxs: rx.Subject<any>) => {
                partners[1].rxRecv.next(data);
            });
        partners.push(ret);
        this.serviceMap.set(cname, partners);
        return ret;
    }

    public connect(cname: string): RxEndpoint {
        const partner = this.serviceMap.get(cname);
        if (!partner && partner.length != 1) {
            return null;
        }
        const ret = new RxEndpoint()
            .send((data: any, rxs: rx.Subject<any>) => {
                partner[0].rxRecv.next(data);
            });
        partner.push(ret);
        return ret;
    }
}

export default MemoryEndpoint;

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
