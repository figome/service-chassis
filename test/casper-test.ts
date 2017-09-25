import { assert } from 'chai';
import * as rx from 'rxjs';
import RxEndpoint from '../src/rx-endpoint';
import ExecFileEndPoint from '../src/execFile-endpoint';
import FirstLastEndpoint from '../src/first-last-endpoint';
import CasperJsExec from '../src/casperjs-exec';
import * as winston from 'winston';

function createCasperJsExec(): RxEndpoint<string> {
    const host_port = '127.0.0.1:45678';
    const eep = ExecFileEndPoint.command('casperjs',
        ['dist/test/casper-echo.js', `--http_server=${host_port}`]);
    eep.input.subscribe((data) => {
        // console.log('casper:', data);
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
    this.timeout(10000);
    before(done => {
        done();
    });

    it('client to server', done => {

        let cje = createCasperJsExec();
        function loop(count: number): void {
            cje.input.subscribe((data: any) => {
                 console.log('....', data);
                if (data == '/started') {
                    cje.output.next(`CTS${count}`);
                    return;
                }
                if (data == '/shutdown') {
                    if (count > 0) {
                        cje = createCasperJsExec();
                        loop(count - 1);
                    } else {
                        done();
                    }
                    return;
                }
                assert.equal(`CTS${count}`, data);
                cje.output.next('/shutdown');
            }, (err) => {
                console.log('error', err);
                assert.fail();
            }, () => {
                console.log('completed');
            });
        }
        loop(3);
    });

});
