
export interface Callback<P> {
    (endpoint?: Endpoint<P>): void;
}


export interface BindCallback {
    (data: any, status?: number, signal?: string): void;

}
export interface Plugin<P> {

    listen(param: P, endpoint: Endpoint<P>, cb: Callback<P>): void;
    connect(param: P, endpoint: Endpoint<P>, cb: Callback<P>): void;
    close(param: P, endpoint: Endpoint<P>, cb: Callback<P>): void;
    send(data: any, param: P, endpoint: Endpoint<P>, cb: Callback<P>): void;

}

export class Endpoint<P> {

    private plugin: Plugin<P>;
    private connectionParams: P;
    public bounded: BindCallback[];
    public boundedError: ((data: any) => void)[];

    constructor(plugin: Plugin<P>) {
        this.plugin = plugin;
        this.bounded = [];
        this.boundedError = [];
    }

    public listen(param: P, cb: Callback<P>) {

        if (this.connectionParams) {
            cb(null);
            return;
        }

        this.connectionParams = param;
        this.plugin.listen(param, this, cb);

    }

    public bind(cb: BindCallback, errCb: (data: any) => void = null) {
        if (errCb) {
          this.boundedError.push(errCb);
        }
        this.bounded.push(cb);

    }

    public connect(param: P, cb: Callback<P>) {

        if (this.connectionParams) {
            cb(null);
            return;
        }

        this.plugin.connect(param, this, (endpoint) => {

            if (endpoint) {
                this.connectionParams = param;
            }

            cb(endpoint);
        })

    }

    public close(cb: Callback<P>) {

        if(!this.connectionParams) {
            cb(null)
            return
        }

        this.plugin.close(this.connectionParams, this, endpoint => {

            endpoint.connectionParams = null
            cb(endpoint)

        })

    }

    public send(data: any, cb: Callback<P>) {

        if(!this.connectionParams) {
            cb(null)
            return
        }

        this.plugin.send(data, this.connectionParams, this, cb)
    }

}
