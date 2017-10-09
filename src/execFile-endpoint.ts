import * as rx from 'rxjs';
import { execFile, ExecFileOptions, ChildProcess } from 'child_process';
import RxEndpoint from './rx-endpoint';

export class ExecFileEndpoint implements RxEndpoint<string> {

    private file: string;
    private args: string[];
    private options: ExecFileOptions;
    private subProcess: ChildProcess;

    public input: rx.Subject<string>;
    public output: rx.Subject<string>;

    public static command(file: string, args: string[] = [], options: ExecFileOptions = {}): ExecFileEndpoint {
        return new ExecFileEndpoint(file, args, options);
    }

    constructor(file: string, args: string[], options: ExecFileOptions) {

        this.file = file;
        this.args = args;
        this.options = options;
        this.input = rx.Observable.create((observer: rx.Observer<string>) => {

            const errorStack: any[] = [];
            this.subProcess = execFile(this.file, this.args, this.options);

            this.subProcess.stdout.on('data', data => {
                observer.next(String(data));
            });

            this.subProcess.stdout.on('error', (error: any) => {
                observer.error(error);
            });

            this.subProcess.stderr.on('data', err => {
                errorStack.push(err);
            });

            this.subProcess.on('close', (status, signal) => {
                if (status !== 0) {
                    observer.error({
                        status: status,
                        signal: signal,
                        errors: errorStack
                    });
                } else {
                    observer.complete();
                }
            });

            this.subProcess.on('error', (_data: any) => {
                errorStack.push(_data);
            });

        });

        this.output = new rx.Subject();
        this.output.subscribe(
            (a) => {
                this.subProcess.stdin.write(a);
            },
            (e) => { /* */ },
            () => {
                this.subProcess.stdin.end();
            }
        );
    }

    public kill(): void {
        this.subProcess.kill();
    }

}

export default ExecFileEndpoint;
