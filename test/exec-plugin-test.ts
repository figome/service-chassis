import ExecPlugin from '../src/exec-plugin';
import { Endpoint, BindCallback } from '../src/endpoint';
import { assert } from 'chai';
import { join } from 'path';

describe('exec plugin', () => {

    describe('send/bind', () => {

        it('can receive if spawned.', done => {

            const plugin = new ExecPlugin();
            const execDingsBums = new Endpoint(plugin);
            const checkArray: string[] = [];

            execDingsBums.bind(data => {

                checkArray.push(data);
                if (data === null) {
                    assert.isNull(checkArray[checkArray.length - 1]);
                    assert.deepEqual(checkArray.slice(0, -1).map(n => parseInt(n, 10)), [1, 2, 3, 4, 5, 6]);
                    done();
                }

            }, data => {
                assert.fail();
                done();
            });

            execDingsBums.connect({
                command: process.execPath,
                argv: [ '-e', '[1, 2, 3, 4, 5, 6].forEach(console.log)' ]
            }, endpoint => {/**/});

        });

        it.only('can send to client and receive call back.', done => {

            const plugin = new ExecPlugin();
            const server = new Endpoint(plugin);
            const checkArray: string[] = [];

            server.bind(data => {
                checkArray.push(data);
                if (data === null) {
                    assert.isNull(checkArray[checkArray.length - 1]);
                    assert.deepEqual(checkArray.slice(0, -1).map(n => parseInt(n, 10)), [1, 2, 3, 4, 5, 6]);
                    done();
                }

            }, data => {
                assert.fail();
                done();
            });

            server.connect({
                command: process.execPath,
                argv: [ join('dist', 'test', 'test-subProcess.js') ]
            }, endpoint => {
                [1, 2, 3, 4, 5, 6].forEach( el => {
                    server.send(`${el}\n`, serverSendEndpoint => {
                        /**/
                    });
                });
            });

        });
    });
});
