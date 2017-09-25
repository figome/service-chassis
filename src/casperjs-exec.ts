
import RxEndpoint from './rx-endpoint';
import * as rx from 'rxjs';
import * as request from 'request';
import * as winston from 'winston';

export class CasperjsExec implements RxEndpoint<string> {

    public input: rx.Subject<string>;
    public output: rx.Subject<string>;

    private retryRequest(url: string, data: any, log: winston.LoggerInstance, rCount = 3): void {
        request.put({
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data,
            timeout: 200
        }, (error, response, body) => {
            if (error && (
                error.code == 'ESOCKETTIMEDOUT' ||
                error.code == 'ECONNREFUSED')) {
                console.log(rCount, error.code);
                if (rCount > 0) {
                    this.retryRequest(url, data, log, rCount - 1);
                }
            } else if (error) {
                (log.error || console.error)('CasperExec:request:failed', url, error);
            }
        });
    }

    constructor(url: string, down: RxEndpoint<string>, log: winston.LoggerInstance = null) {
        this.output = new rx.Subject();
        this.input = down.input;
        this.output.subscribe((data) => {
            console.log('casperjs.output=', url, data);
            this.retryRequest(url, data, log);
        });
    }

}

export default CasperjsExec;
