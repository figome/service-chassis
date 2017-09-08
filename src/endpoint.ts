import ServiceChassis, { Callback, Plugin, BindCallback } from './service-chassis';

export default class Endpoint<P> implements ServiceChassis<P> {

    protected plugin: Plugin<P>;
    public connectionParams: P;
    public bounded: BindCallback[];
    public boundedError: ((data: any) => void)[];

    constructor(plugin: Plugin<P>) {
        this.plugin = plugin;
        this.bounded = [];
        this.boundedError = [];
    }

    public listen(param: P, cb: Callback<P>): ServiceChassis<P> {

        if (this.connectionParams) {
            cb(null);
            return this;
        }

        this.connectionParams = param;
        this.plugin.listen(param, this, cb);

        return this;
    }

    public connect(param: P, cb: Callback<P>): ServiceChassis<P> {

        if (this.connectionParams) {
            cb(null);
            return this;
        }

        this.plugin.connect(param, this, (endpoint) => {

            if (endpoint) {
                this.connectionParams = param;
            }

            cb(endpoint);
        });

        return this;
    }

    public close(cb: Callback<P>): void {

        if (!this.connectionParams) {
            cb(null);
            return;
        }

        this.plugin.close(this.connectionParams, this, endpoint => {

            endpoint.connectionParams = null;
            cb(endpoint);

        });

    }

    public bind(cb: BindCallback, errCb: (data: any) => void = null): void {
        if (errCb) {
          this.boundedError.push(errCb);
        }

        this.bounded.push(cb);

    }

    public write(data: any, cb: Callback<P>): void {

        if (!this.connectionParams) {
            cb(null);
            return;
        }

        this.plugin.write(data, this, cb);
    }

    public gulp(data: any, cb: Callback<P>): void {/**/}

    public feed(data: any, cb: Callback<P>): void {
        this.plugin.feed(data, this, cb);
    }

}
