import { Plugin, Endpoint, Param, Callback } from './endpoint'

export class MemoryPlugin implements Plugin {
    
    private serviceMap:Map<string, Endpoint[]>

    constructor() {

        this.serviceMap = new Map<string, Endpoint[]>()

    }

    public listen(param: Param, endpoint: Endpoint, cb: Callback) {
        if(this.serviceMap.has(param.channelName)) {
            cb(null)
            return
        }
        this.serviceMap.set(param.channelName, [endpoint])
        cb(endpoint)

    }

    public connect(param:Param, endpoint:Endpoint, cb: Callback) {
        const map = this.serviceMap.get(param.channelName)
        if (!map) {
            cb(null)
            return
        }
        if (map.length != 1) {
            cb(null)
            return
        }
        map.push(endpoint);
        cb(endpoint)

    }

    public close(param:Param, endpoint:Endpoint, cb: Callback) {

        this.serviceMap.delete(param.channelName)
        cb(endpoint)

    }

    public send(data:any, param:Param, endpoint:Endpoint, cb: Callback) {

        const endpointToSendTo = this.serviceMap.get(param.channelName).find((i) => endpoint !== i)

        if(!endpointToSendTo) {
            cb(null)
            return
        }

        endpointToSendTo.bounded.forEach( bound => bound(data) )

        cb(endpoint)

    }
}

export default MemoryPlugin;