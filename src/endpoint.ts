
export interface Callback {
    (endEoint?: Endpoint) : void;
}

export interface Param {
    channelName: string;
}


export interface Plugin {

    listen(param: Param, endpoint: Endpoint, cb: Callback) : void
    connect(param:Param, endpoint:Endpoint, cb: Callback) : void
    close(param:Param, endpoint:Endpoint, cb: Callback) : void
    send(data:any, param:Param, endpoint:Endpoint, cb: Callback) : void

}


export class Endpoint {

    private plugin:Plugin;
    private connectionParams:Param;
    public bounded:((data:any) => void)[];

    constructor(plugin: Plugin) {
        this.plugin = plugin;
        this.bounded = []
    }

    public listen(param:Param, cb: Callback) {

        if(this.connectionParams) {
            cb(null)
            return
        }

        this.connectionParams = param
        this.plugin.listen(param, this, cb)

    }

    public bind(cb:(data:any) => void) {

        this.bounded.push(cb)

    }

    public connect(param:Param, cb: Callback) {

        if(this.connectionParams) {
            cb(null)
            return
        }

        this.plugin.connect(param, this, (endpoint) => {

            if(endpoint) {
                this.connectionParams = param
            }

            cb(endpoint)
        })

    }

    public close(cb: Callback) {

        if(!this.connectionParams) {
            cb(null)
            return
        }

        this.plugin.close(this.connectionParams, this, endpoint => {

            endpoint.connectionParams = null
            cb(endpoint)

        })

    }

    public send(data:any, cb: Callback) {

        if(!this.connectionParams) {
            cb(null)
            return
        }

        this.plugin.send(data, this.connectionParams, this, cb)
    }

}
