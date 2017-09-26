import * as rx from 'rxjs';

import CasperMsg from '../src/casper-msg';
import * as simqle from 'simqle';

export class CasperjsBinding {

    public input: rx.Subject<CasperMsg<any>>;
    public output: rx.Subject<CasperMsg<any>>;

    constructor(listenAdr: string) {
        this.input = new rx.Subject();
        const logger = new rx.Subject<simqle.LogMsg>();
        logger.subscribe(a => console.log(JSON.stringify(a)));
        const q = simqle.start(logger, {});
        const server = require('webserver').create();
        server.listen(listenAdr, (request: any, response: any) => {
            const cmsg = CasperMsg.from(request, response);
            if (!cmsg) {
                response.statusCode = 500;
                response.write('<html><body>casper unknown message</body></html>');
                response.close();
                return;
            }
            if (cmsg.url == '/waitOutput') {
                q.q.subscribe((data) => {
                    console.log('WaitFor:sub');
                    q.q.unsubscribe();
                    data.task.subscribe(msg => {
                        console.log('WaitFor:sub:task:', msg);
                        cmsg.res.statusCode = 200;
                        cmsg.res.write(msg);
                        cmsg.res.close();
                    });
                });
            } else {
                this.input.next(cmsg);
            }
        });
        this.output = new rx.Subject();
        this.output.subscribe((a) => {
            console.log('q-push', q.qEntries.length);
            q.push(rx.Observable.create((obs: rx.Observer<any>) => {
                console.log('q.push:', JSON.stringify(a));
                obs.next(a);
                obs.complete();
            }));
        });
        q.deadLetter.subscribe(a => {
            console.log('DEADLETTER:', a);
        });
    }

}

export default CasperjsBinding;
