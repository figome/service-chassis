// import ExecPlugin, { Param } from '../src/plugins/exec-plugin';
// import ServiceChassis, { BindCallback } from '../src/service-chassis';
import RxEndpoint from '../my/rx-endpoint';
import ExecEndpoint from '../my/exec-endpoint';

import { assert } from 'chai';
import * as path from 'path';

function readAssert(rxep: RxEndpoint, done: any): void {
  function flatten<T>(arr: T[][]): T[] {
    return Array.prototype.concat(...arr);
  }
  const checkArray: string[] = [];
  rxep.rxRecv.subscribe(data => {
    console.log('found', data);
    checkArray.push(data);
  }, data => {
    assert.fail();
    done();
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
    const eep = new ExecEndpoint();
    eep.rxRecv.subscribe((data: any) => {
      assert.fail('never called');
    }, (data) => {
      assert.equal(data[0].code, 'ENOENT');
      assert.equal(data[1].status, -2);
    }, () => {
      assert.equal(1, 1);
      done();
    });
    eep.command('/wtf/wtf');
  });

  it('can exit code', done => {
    const eep = new ExecEndpoint();
    eep.rxRecv.subscribe((data: any) => {
      assert.fail('never called');
    }, (data) => {
      assert.equal(data[0].status, 47);
    }, () => {
      done();
    });
    eep.command(process.execPath, ['-e', 'process.exit(47)']);
  });

  it('can receive if spawned.', done => {

    const eep = new ExecEndpoint();
    readAssert(eep, done);
    eep.command(
      process.execPath,
      ['-e', '[1, 2, 3, 4, 5, 6].forEach(el => console.log(el))']);
  });

  it.only('can span a echo server', done => {
    const eep = new ExecEndpoint();
    const checkArray: string[] = [];

    readAssert(eep, () => {
      console.log('complete my side');
      done();
    });

    eep.command(process.execPath,
      [path.join('dist', 'test', 'echo-process.js')]);

    [1, 2, 3, 4, 5, 6].forEach((el) => {
      eep.rxSend.next(`${el}\n`);
    });
    eep.rxSend.complete();
  });

});
