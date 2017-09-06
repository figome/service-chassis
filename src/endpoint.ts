/*
 * INTERFACES
 */
export interface Callback<P> {
    (endpoint?: ServiceChassis<P>): void;
}

export interface ReadCallback<P> {
    (data: any, endpoint: ServiceChassis<P>): void;
}

export interface BindCallback {
    (data: any, status?: number, signal?: string): void;
}

export abstract class Plugin<P> {
    public abstract listen(param: P, endpoint: ServiceChassis<P>, cb: Callback<P>): void;
    public abstract connect(param: P, endpoint: ServiceChassis<P>, cb: Callback<P>): void;
    public abstract close(param: P, endpoint: ServiceChassis<P>, cb: Callback<P>): void;
    public read(data: any, endpoint: ServiceChassis<P>, cb: ReadCallback<P>): void {
        cb(data, endpoint);
    }
    public abstract write(data: any, param: P, endpoint: ServiceChassis<P>, cb: Callback<P>): void;
}

/*
 * SERVICE CHASSIS
 */
export default class ServiceChassis<P> {

    private plugin: Plugin<P>;
    private connectionParams: P;
    public bounded: BindCallback[];
    public boundedError: ((data: any) => void)[];

    constructor(plugin: Plugin<P>) {
        this.plugin = plugin;
        this.bounded = [];
        this.boundedError = [];
    }

    public listen(param: P, cb: Callback<P>): void {

        if (this.connectionParams) {
            cb(null);
            return;
        }

        this.connectionParams = param;
        this.plugin.listen(param, this, cb);

    }

    public connect(param: P, cb: Callback<P>): void {

        if (this.connectionParams) {
            cb(null);
            return;
        }

        this.plugin.connect(param, this, (endpoint) => {

            if (endpoint) {
                this.connectionParams = param;
            }

            cb(endpoint);
        });

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

    public read(cb: BindCallback, errCb: (data: any) => void = null): void {
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

        this.plugin.write(data, this.connectionParams, this, cb);
    }

}
