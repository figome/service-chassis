import { Plugin, Endpoint, Callback } from './endpoint';

export interface Param {}

export class SimplePlugin implements Plugin<Param> {

    public listen(param: Param, endpoint: Endpoint<Param>, cb: Callback<Param>): void {
        process.stdin.on('data', stuff => {
            endpoint.bounded.forEach( bound => bound(stuff));
        });

        process.stdin.on('close', () => {
            process.exit(9001);
        });

        cb(endpoint);
    }

    public connect(param: Param, endpoint: Endpoint<Param>, cb: Callback<Param>): void {
        cb(endpoint);
    }

    public close(param: Param, endpoint: Endpoint<Param>, cb: Callback<Param>): void {
        cb(endpoint);
    }

    public send(data: any, param: Param, endpoint: Endpoint<Param>, cb: Callback<Param>): void {
        console.log(data);
    }
}

export default SimplePlugin;
