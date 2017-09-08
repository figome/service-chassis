import ServiceChassis, { Callback, Plugin, BindCallback } from './service-chassis';
import Endpoint from './endpoint';

export default class NestedEndpoint<P, PS> extends Endpoint<P> {

    private nestedEndpoint: ServiceChassis<PS>;

    constructor(plugin: Plugin<P>, param: P, endpoint: ServiceChassis<PS>) {
        super(plugin);
        this.nestedEndpoint = endpoint;
        this.nestedEndpoint.bind(data => {
            if (data) {
                this.plugin.read(data.toString('utf8'), param, this, () => {/**/});
            }
        }, null);
    }

    public read(cb: BindCallback, errCb: (data: any) => void = null): void {
        if (errCb) {
          this.boundedError.push(errCb);
        }

        this.bounded.push(cb);
        if (this.bounded.length === 1) {
            this.plugin.read(this.bounded);
        }
    }

    public write(data: any, cb: Callback<P>): void {

        if (!this.connectionParams) {
            cb(null);
            return;
        }

        this.plugin.write(data, writeData => {
            this.nestedEndpoint.feed(data, cb);
        });
    }

    public gulp(data: any, cb: Callback<P>): void {
        this.nestedEndpoint.feed(data, cb);
    }

    public feed(data: any, cb: Callback<P>): void {
        this.plugin.read(data, this.connectionParams, this, () => {
            this.bounded.forEach(bound => bound(data));
            cb();
        });
    }
}
