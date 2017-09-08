import ServiceChassis, { Plugin, Callback, DataCallback } from '../service-chassis';
import PayloadParser from '../msg-parser/stream-payload';
export interface Param {}

export class PayloadParserPlugin extends Plugin<Param> {

    private parser: PayloadParser;

    constructor(first: string, last: string) {
        super();
        this.parser = new PayloadParser(first, last);
    }

    public listen(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        cb(endpoint);
    }

    public connect(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        cb(endpoint);
    }

    public close(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        cb(endpoint);
    }

    public write(data: any, cb: DataCallback ): void {
        cb(this.parser.write(data));
    }

    public feed(data: any, param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        this.parser.feed(data.toString('utf8'), 0, (payload) => {
            endpoint.bounded.forEach(bound => bound(payload));
        });
        cb(endpoint);
    }
}

export default PayloadParserPlugin;
