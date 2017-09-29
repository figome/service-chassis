import ExecFileEndpoint from '../src/execFile-endpoint';
import * as rx from 'rxjs';

import { assert } from 'chai';
import * as path from 'path';

const flatten = (arr: string[][]): string[] => Array.prototype.concat(...arr);

function normalizeArray(arr: any[]): number[] {

    const arrWithoutWS = arr.map(el => String(el).split('\n'));

    return flatten(arrWithoutWS)
        .filter(el => el !== '')
        .map(n => parseInt(n, 10));

}

function readAssert(rxep: ExecFileEndpoint, done: any): void {

  const checkArray: string[] = [];

    rxep.input.subscribe(
        data => {
            checkArray.push(data);
        },
        error => {
            assert.fail('ERROR should not received', error);
        },
        () => {
            assert.deepEqual( normalizeArray(checkArray), [1, 2, 3, 4, 5, 6] );
            done();
        }
    );
}

describe('execFile', () => {

    it('can error', done => {

        const eep = ExecFileEndpoint.command('/wtf/wtf');

        eep.input.subscribe((data: any) => {
            assert.fail('never called');
        },
        (error) => {
            assert.equal((error[0] as any).code, 'ENOENT');
            const status = (error[1] as any).status;
            // node 6 return -2
            // node 0.10 return -1
            assert.isTrue(status < 0);
            done();
        },
        () => {
            assert.fail('never called');
        });

    });

    it('can exit code', done => {

        const eep = ExecFileEndpoint.command(process.execPath, ['-e', 'process.exit(47)']);

        eep.input.subscribe((data: any) => {
            assert.fail('never called');
        },
        (data) => {
            assert.equal((data[0] as any).status, 47);
            done();
        },
        () => {
            assert.fail('never called');
        });

    });

    it('can receive if spawned.', done => {

        const eep = ExecFileEndpoint.command(
            process.execPath,
            ['-e', '[1, 2, 3, 4, 5, 6].forEach(function(el) { console.log(el); })']
        );

        readAssert(eep, done);

    });

    it('can span a echo server', done => {

        const eep = ExecFileEndpoint.command(
            process.execPath,
            [ path.join('dist', 'test', 'helper', 'process-echo.js') ]
        );

        readAssert(eep, done);

        [1, 2, 3, 4, 5, 6].forEach((el) => {
            eep.output.next(`${el}\n`);
        });

        eep.output.complete();

    });

});
