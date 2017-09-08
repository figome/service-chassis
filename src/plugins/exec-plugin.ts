import ServiceChassis, { Plugin, Callback } from '../service-chassis';
import * as stream from 'stream';
import { spawn, ChildProcess } from 'child_process';

export interface Param {
    command: string;
    argv: string[];
}

export class ExecPlugin extends Plugin<Param> {

    private toSubProcess: stream.Writable;
    private fromSubProcess: stream.Readable;
    private subProcess: ChildProcess;
    private killTimeout: number;

    constructor(waitBeforeKill = 500) {
        super();
        this.killTimeout = waitBeforeKill;
    }

    public listen(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {/**/}

    public connect(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {

        this.subProcess = spawn(param.command, param.argv);

        this.subProcess.on('close', (status, signal) => {
            endpoint.bounded.forEach( bound => bound(null, status, signal));
        });

        this.subProcess.on('error', (data: any) => {
            endpoint.boundedError.forEach( bound => bound(data));
        });

        this.toSubProcess = this.subProcess.stdin;
        this.fromSubProcess = this.subProcess.stdout;

        this.fromSubProcess.on('data', data => {
            endpoint.bounded.forEach( bound => bound(data));
        });

        cb(endpoint);
    }

    public close(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {

        this.toSubProcess.end(() => {
            setTimeout(() => {

                this.subProcess.kill();
                cb(endpoint);

            }, this.killTimeout);
        });

    }

    public read(data: any, param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {

        this.toSubProcess.write(data, () => {
            cb(endpoint);
        });
    }

}

export default ExecPlugin;
