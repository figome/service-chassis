import { Plugin, Endpoint, Callback } from './endpoint';

export interface Param {
    channelName: string;
}

export class MemoryPlugin implements Plugin<Param> {

    private serviceMap: Map<string, Endpoint<Param>[]>;

    constructor() {

        this.serviceMap = new Map<string, Endpoint<Param>[]>();

    }

    public listen(param: Param, endpoint: Endpoint<Param>, cb: Callback<Param>): void {
        if (this.serviceMap.has(param.channelName)) {
            cb(null);
            return;
        }
        this.serviceMap.set(param.channelName, [endpoint]);
        cb(endpoint);

    }

    public connect(param: Param, endpoint: Endpoint<Param>, cb: Callback<Param>): void {
        const map = this.serviceMap.get(param.channelName);
        if (!map) {
            cb(null);
            return;
        }
        if (map.length != 1) {
            cb(null);
            return;
        }
        map.push(endpoint);
        cb(endpoint);

    }

    public close(param: Param, endpoint: Endpoint<Param>, cb: Callback<Param>): void {

        this.serviceMap.delete(param.channelName);
        cb(endpoint);

    }

    public send(data: any, param: Param, endpoint: Endpoint<Param>, cb: Callback<Param>): void {

        const endpointToSendTo = this.serviceMap.get(param.channelName).find((i) => endpoint !== i);

        if (!endpointToSendTo) {
            cb(null);
            return;
        }

        endpointToSendTo.bounded.forEach( bound => bound(data) );

        cb(endpoint);

    }
}

export default MemoryPlugin;
