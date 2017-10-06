
import RxEndpoint from './rx-endpoint';
import * as rx from 'rxjs';
import * as request from 'request';

export class CasperjsExec implements RxEndpoint<string> {

    public input: rx.Subject<string>;
    public output: rx.Subject<string>;

    constructor(url: string, down: RxEndpoint<string>) {
        this.output = new rx.Subject();
        this.input = down.input;
        this.output.subscribe(
            data => {
                request.put({
                    url: url,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: data
                }, (error, response, body) => {
                    if (error) {
                        console.error('CasperExec:request:failed', url);
                    }
                });
            }
        );
    }

}

export default CasperjsExec;
