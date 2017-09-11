import * as rx from './urxjs';
import PayloadParser from './payload-parser';

export class Connection {

  public input: rx.Subject<string>;
  public output: rx.Subject<string>;

  constructor(partners: Connection[], idx: number) {
    this.input = new rx.Subject();
    this.input.subscribe(
        null,
        (error) => { partners[idx].input.error(error); },
        () => { partners[idx].input.complete(); });
    this.output = new rx.Subject();
    this.output.subscribe(
        data => { partners[idx].input.next(data); },
        (error) => { partners[idx].input.error(error); },
        () => { partners[idx].input.complete(); });
  }
}

export class MemoryEndpoint {
    private serviceMap: Map<string, Connection[]>;

    constructor() {
        this.serviceMap = new Map<string, Connection[]>();
    }

    public listen(cname: string): Connection {
        if (this.serviceMap.has(cname)) {
            return null;
        }
        const partners: Connection[] = [];
        const ret = new Connection(partners, 1);
        partners.push(ret);
         this.serviceMap.set(cname, partners);
        return ret;
    }

    public connect(cname: string): Connection {
        const partners = this.serviceMap.get(cname);
        if (!partners && partners.length != 1) {
            return null;
        }
        const ret = new Connection(partners, 0);
        partners.push(ret);
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
