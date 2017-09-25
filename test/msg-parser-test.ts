import { assert } from 'chai';
import ExecEndpoint from '../src/exec-endpoint';
import FirstLastEndpoint from '../src/first-last-endpoint';
import * as path from 'path';
import * as rx from 'rxjs';


    describe('first-last messages', () => {
        before(done => {
            done();
        });

        it('echo test', done => {
            const eep = ExecEndpoint.command(process.execPath,
                [path.join('dist', 'test', 'echo-process.js')]);
            const flep = new FirstLastEndpoint('__BEG__', '__END__', eep);

            let nextish = 4;
            let count = 0;
            flep.input.subscribe(
                (data) => {
                    assert.equal(`Hello World ${count++}`, data);
                    if (nextish == count) {
                        flep.output.complete();
                    }
                },
                (error) => { assert.fail(); },
                () => {
                    assert.equal(count, nextish);
                    done();
                });
            for (let i = 0; i < nextish; ++i) {
                flep.output.next(`Hello World ${i}`);
            }
        });

        it('echo test with client crashes', done => {
            const eep = ExecEndpoint.command(process.execPath,
                [path.join('dist', 'test', 'echo-process.js')]);
            const flep = new FirstLastEndpoint('__BEG__', '__END__', eep);

            flep.input.subscribe(
                (data) => {
                    assert.equal(`Hello World 0`, data);
                },
                (error) => {
                    assert.equal(error[0].status, 66);
                    done();
                },
                () => {
                    assert.fail();
                });
            flep.output.next(`Hello World 0`);
            flep.output.next(`CORE`);
        });

    });

