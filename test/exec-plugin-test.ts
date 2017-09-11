// import ExecPlugin, { Param } from '../src/plugins/exec-plugin';
// import ServiceChassis, { BindCallback } from '../src/service-chassis';
// import RxEndpoint from '../my/rx-endpoint';
import ExecEndpoint from '../my/exec-endpoint';

import { assert } from 'chai';
import * as path from 'path';

function readAssert(rxep: ExecEndpoint, done: any): void {
  function flatten<T>(arr: T[][]): T[] {
    return Array.prototype.concat(...arr);
  }
  const checkArray: string[] = [];
  rxep.input.subscribe(data => {
    // console.log('found', data);
    checkArray.push(data);
  }, (error) => {
    assert.fail('ERROR should not received');
  }, () => {
    assert.deepEqual(
      flatten(checkArray.map(el => {
        return String(el).split('\n');
      }))
        .filter(el => el !== '')
        .map(n => parseInt(n, 10)), [1, 2, 3, 4, 5, 6]
    );
    done();
  });
}

describe('exec plugin', () => {

  it('can error', done => {
    const eep = ExecEndpoint.command('/wtf/wtf');
    eep.input.subscribe((data: any) => {
      assert.fail('never called');
    }, (error) => {
      assert.equal((error[0] as any).code, 'ENOENT');
      assert.equal((error[1] as any).status, -2);
      done();
    }, () => {
      assert.fail('never called');
    });
    // eep.exec();
  });

  it('can exit code', done => {
    const eep = ExecEndpoint.command(process.execPath, ['-e', 'process.exit(47)']);
    eep.input.subscribe((data: any) => {
      assert.fail('never called');
    }, (data) => {
      assert.equal((data[0] as any).status, 47);
      done();
    }, () => {
      assert.fail('never called');
    });
    // eep.exec();
  });

  it('can receive if spawned.', done => {

    const eep = ExecEndpoint.command(
      process.execPath,
      ['-e', '[1, 2, 3, 4, 5, 6].forEach(el => console.log(el))']);
    readAssert(eep, done);
    // eep.exec();
  });

  it('can span a echo server', done => {
    const eep = ExecEndpoint.command(process.execPath,
      [path.join('dist', 'test', 'echo-process.js')]);
    const checkArray: string[] = [];

    readAssert(eep, () => {
      // console.log('complete my side');
      done();
    });
    // eep.exec();

    [1, 2, 3, 4, 5, 6].forEach((el) => {
      eep.output.next(`${el}\n`);
    });
    eep.output.complete();
  });

});
