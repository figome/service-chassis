import { assert } from 'chai';
import * as rx from 'rxjs';
import RxEndpoint from '../src/rx-endpoint';
import ExecFileEndPoint from '../src/execFile-endpoint';
import FirstLastEndpoint from '../src/first-last-endpoint';
import CasperJsExec from '../src/casperjs-exec';
import * as winston from 'winston';

function createCasperJsExec(count: number): RxEndpoint<string> {
    console.log('createCasperJsExec:', count);
    const host_port = `127.0.0.1:${45678 + count}`;
    const eep = ExecFileEndPoint.command('casperjs',
        ['dist/test/casper-echo.js', `--http_server=${host_port}`]);
    eep.input.subscribe((data) => {
        console.log('casper:', data);
    }, (err) => {
        console.error('createCasperJsExec', err);
    });
    const log: winston.LoggerInstance = new (winston.Logger)({
        transports: [new (winston.transports.Console)()]
    });

    const cjep = new CasperJsExec(`http://${host_port}/`, eep, log);
    return new FirstLastEndpoint('_mi8o_', '_mi8o_', cjep);
}

describe(`CasperJsEcho:`, function (): void {
    this.timeout(30000);
    before(done => {
        done();
    });

    it('client to server', done => {

        let cje = createCasperJsExec(3);
        function loop(count: number): void {
            console.log('Loop', count);
            let looped: number;
            cje.input.subscribe((data: any) => {
                console.log('....', count, data);
                if (data == '/started') {
                    looped = 5;
                    cje.output.next(`CTS${count}.${looped}`);
                    return;
                }
                if (data == `CTS${count}.${looped}` && looped > 0) {
                    cje.output.next(`CTS${count}.${--looped}`);
                    return;
                }
                if (data == '/shutdown') {
                    console.log('received shutdown');
                    return;
                }
                console.log('send shutdown');
                cje.output.next('/shutdown');
                return;
            }, (err) => {
                console.log('error', err);
                assert.fail();
            }, () => {
                console.log('completed');
                if (count > 0) {
                    cje = createCasperJsExec(--count);
                } else if (count == 0) {
                    done();
                }
            });
        }
        loop(3);
    });

});
