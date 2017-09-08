import ServiceChassis, { Plugin, Callback } from '../service-chassis';

export interface Param {}

export class ReflectorPlugin extends Plugin<Param> {

    public listen(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        cb(endpoint);
    }

    public connect(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        cb(endpoint);
    }

    public close(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        cb(endpoint);
    }

    public read(data: any, param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        endpoint.bounded.forEach(bound => bound(data));
        cb(endpoint);
    }
}

export default ReflectorPlugin;
