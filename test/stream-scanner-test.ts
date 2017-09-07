import StreamScanner from '../src/msg-parser/stream-scanner';
import { assert } from 'chai';
import { fragentize } from './hexler-helper';

describe('stream-scanner', () => {

  it('find with empty heystack', (done) => {
      const s2 = new StreamScanner('');
      const needle = 'Hello World';
      let count = needle.length;
      s2.feed(needle, 0, (f, ofs) => --count, () => {/* */});
      assert.equal(0, count);
      done();
  });

  it('find', (done) => {
    fragentize().forEach((hexle) => {
      hexle.hexle.forEach(fragments => {
        const s2 = new StreamScanner('__Juju--');
        let count = hexle.findCount;
        fragments.forEach(fragment => {
          s2.feed(fragment, 0, (f, ofs) => --count, () => {/* */});
        });
        assert.equal(0, count);
      });
    });
    done();
  });

});
