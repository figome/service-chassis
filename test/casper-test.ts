import { assert } from 'chai';
import * as rx from 'rxjs';
import * as path from 'path';

import RxEndpoint from '../src/rx-endpoint';
import ExecFileEndpoint from '../src/execFile-endpoint';
import FirstLastEndpoint from '../src/first-last-endpoint';
import CasperJsExec from '../src/casperjs-exec';

const casperEchoHelper = path.join('dist', 'test', 'helper',  'casper-echo.js');

describe(`CasperJs echo:`, function (): void {

    it('sends messages to casperjs process.', done => {

        const host_port = '127.0.0.1:45678';
        const eep = ExecFileEndpoint.command( 'casperjs', [ casperEchoHelper, `--http_server=${host_port}` ] );
        const cjep = new CasperJsExec(`http://${host_port}/`, eep);
        const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', cjep);

        flep.input.subscribe(data => {
            switch (data) {
                case '/startedServer':
                    flep.output.next('/shutdown');
                    break;
                case '/casperDone':
                    eep.kill();
                    done();
                    break;
                case '/failedToStartServer':
                default:
                    eep.kill();
                    assert.fail();
            }
        });

    });

    it('sends messages back and forth between node and casperjs.', done => {

        const host_port = '127.0.0.1:45678';
        const eep = ExecFileEndpoint.command( 'casperjs', [ casperEchoHelper, `--http_server=${host_port}` ] );
        const cjep = new CasperJsExec(`http://${host_port}/`, eep);
        const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', cjep);

        let count = 100;

        function loop(counter: number): void {
            if (counter === 0) {
                flep.output.next('/shutdown');
                return;
            }

            flep.output.next(`PING${String(counter)}`);
        }

        flep.input.subscribe(data => {
            switch (data) {
                case '/startedServer':
                    loop(count);
                    break;
                case '/casperDone':
                    eep.kill();
                    done();
                    break;
                case '/failedToStartServer':
                    eep.kill();
                    assert.fail();
                    break;
                default:
                    assert.equal(data, `PING${String(count)}`);
                    loop(--count);
            }
        });

    });
});
