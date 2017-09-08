import ServiceChassis, { Plugin, Callback } from '../service-chassis';

export interface Param {}

export class DebugPlugin extends Plugin<Param> {

    public listen(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        console.log('LISTEN:', param);
        cb(endpoint);
    }

    public connect(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        console.log('CONNECT', param);
        cb(endpoint);
    }

    public close(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        console.log('CLOSE', param);
        cb(endpoint);
    }

    public read(data: any, param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        console.log('WRITE', data.toString('utf8'));
        endpoint.bounded.forEach(bound => bound(data));
        cb(endpoint);
    }
}

export default DebugPlugin;
