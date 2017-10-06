import { assert } from 'chai';
import * as path from 'path';

import ExecFileEndpoint from '../src/execFile-endpoint';
import FirstLastEndpoint from '../src/first-last-endpoint';
import CasperJsExec from '../src/casperjs-exec';

const casperEchoHelper = path.join('dist', 'test', 'helper',  'casper-echo.js');

describe('Endpoint casperJs', function (): void {

    it('can start and stop a casperJs process.', done => {

        const host_port = '127.0.0.1:45678';
        const eep = ExecFileEndpoint.command( 'casperjs', [ casperEchoHelper, `--http_server=${host_port}` ] );
        const cjep = new CasperJsExec(`http://${host_port}/`, eep);
        const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', cjep);

        flep.input.subscribe(
            data => {
                if (data === '/startedServer') {
                    flep.output.next('/shutdown');
                }
            },
            err => {
                assert.fail();
            },
            () => {
                done();
            }
        );

    });

    it('can start and stop multiple casperJs processes.', function(done): void {

        let processPorts = [ '45678', '45679', '45680', '45681', '45682' ];

        function createCasperProcess(port: string, cb: (port: string) => void): void {

            const host_port = `127.0.0.1:${port}`;
            const eep = ExecFileEndpoint.command( 'casperjs', [ casperEchoHelper, `--http_server=${host_port}` ] );
            const cjep = new CasperJsExec(`http://${host_port}/`, eep);
            const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', cjep);

            flep.input.subscribe(
                data => {
                    if (data === '/startedServer') {
                        flep.output.next('/shutdown');
                    }
                },
                err => {
                    assert.fail();
                },
                () => {
                    cb(port);
                }
            );
        }

        function assertDone(port: string): void {

            const index = processPorts.indexOf(port);

            assert.isTrue(index > -1);

            processPorts.splice(index, 1);

            if (processPorts.length === 0) {
                done();
            }
        }

        processPorts.forEach( port => createCasperProcess(port, assertDone));
    });

    it('can catch error if casper webserver fails to start.', done => {
        const host_port = 'XXXXXXX';
        const eep = ExecFileEndpoint.command( 'casperjs', [ casperEchoHelper, `--http_server=${host_port}` ] );
        const cjep = new CasperJsExec(`http://${host_port}/`, eep);
        const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', cjep);

        flep.input.subscribe(
            data => {
                assert.fail('I will never be called');
            },
            err => {
                assert.deepEqual(err, '/failedToStartServer');
                done();
            }
        );
    });

    it('can catch catch known exceptions during execution of the casperJs script.', done => {
        const host_port = '127.0.0.1:45678';
        const eep = ExecFileEndpoint.command( 'casperjs', [ casperEchoHelper, `--http_server=${host_port}` ] );
        const cjep = new CasperJsExec(`http://${host_port}/`, eep);
        const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', cjep);

        flep.input.subscribe(
            data => {
                if (data === '/startedServer') {
                    flep.output.next('/provokeEndpointError');
                    return;
                }

                assert.fail('never called');
            },
            err => {
                assert.deepEqual(err, '/endpointError');
                done();
            }
        );
    });

    it('can send messages back and forth between node and casperJs.', done => {

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

        flep.input.subscribe(
            data => {
                if (data === '/startedServer') {

                    loop(count);

                } else {

                    assert.equal(data, `PING${String(count)}`);
                    loop(--count);

                }
            },
            err => {
                assert.fail();
            },
            () => {
                done();
            }
        );

    });
});
