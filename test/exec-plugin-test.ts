import ExecPlugin, { Param } from '../src/plugins/exec-plugin';
import ServiceChassis, { BindCallback } from '../src/service-chassis';
import Endpoint from '../src/endpoint';

import { assert } from 'chai';
import * as path from 'path';

function readAssert(server: ServiceChassis<Param>, done: any): void {

    function flatten<T> (arr: T[][]): T[] {
        return Array.prototype.concat(...arr);
    }

    const checkArray: string[] = [];

    server.bind(data => {
        checkArray.push(data);
        if (data === null) {
            assert.isNull(checkArray[checkArray.length - 1]);
            assert.deepEqual(
                flatten(checkArray.slice(0, -1).map(el => {
                    return String(el).split('\n');
                }))
                    .filter( el => el !== '')
                    .map(n => parseInt(n, 10)), [1, 2, 3, 4, 5, 6]
            );

            done();
        }

    }, data => {
        assert.fail();
        done();
    });

}

describe('exec plugin', () => {

    describe('send/bind', () => {

        it('can receive if spawned.', done => {

            const plugin = new ExecPlugin();
            const server = new Endpoint(plugin);

            readAssert(server, done);

            server.connect({
                command: process.execPath,
                argv: [ '-e', '[1, 2, 3, 4, 5, 6].forEach(el => console.log(el))' ]
            }, endpoint => {/**/});

        });

        it('can send to client and receive call back.', done => {

            const plugin = new ExecPlugin();
            const server = new Endpoint(plugin);
            const checkArray: string[] = [];

            readAssert(server, done);

            server.connect({
                command: process.execPath,
                argv: [ path.join('dist', 'test', '_test-subProcess.js') ]
            }, endpoint => {
                [1, 2, 3, 4, 5, 6].forEach( (el, index, all) => {
                    server.write(`${el}\n`, serverSendEndpoint => {
                       if (index == all.length - 1) {
                           server.close(() => {/**/});
                       }
                    });
                });
            });

        });
    });
});
