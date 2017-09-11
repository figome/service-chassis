// import ExecPlugin, { Param } from '../src/plugins/exec-plugin';
// import ServiceChassis, { BindCallback } from '../src/service-chassis';
// import RxEndpoint from '../my/rx-endpoint';
import ExecEndpoint from '../src/exec-endpoint';
import * as rx from '../src/abstract-rx';

import { assert } from 'chai';
import * as path from 'path';

function readAssert(rxep: ExecEndpoint, done: any): void {
  function flatten<T>(arr: T[][]): T[] {
    const tmp = Array.prototype.concat(...arr);
    // console.log('flatten:', arr, tmp);
    return tmp;
  }
  const checkArray: string[] = [];
  rxep.input.subscribe(data => {
    // console.log('found', data);
    checkArray.push(data);
  }, (error) => {
    assert.fail('ERROR should not received', error);
  }, () => {
    // console.log('>>>>>>', checkArray);
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

['rxjs', null].forEach(rxName => {

  describe('exec plugin', () => {
    before(done => {
      rx.inject(rxName);
      done();
    });

    it('can error', done => {
      const eep = ExecEndpoint.command('/wtf/wtf');
      eep.input.subscribe((data: any) => {
        assert.fail('never called');
      }, (error) => {
        // console.log(error);
        assert.equal((error[0] as any).code, 'ENOENT');
        const status = (error[1] as any).status;
        // node 6 return -2
        // node 0.10 return -1
        assert.isTrue(status < 0);
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
        ['-e', '[1, 2, 3, 4, 5, 6].forEach(function(el) { console.log(el); })']);
      readAssert(eep, done);
      // eep.exec();
    });

    it('can span a echo server', done => {
      const eep = ExecEndpoint.command(process.execPath,
        [path.join('dist', 'test', 'echo-process.js')]);

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

});
