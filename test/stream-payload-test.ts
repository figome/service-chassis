import StreamPayload from '../src/msg-parser/stream-payload';
import { assert } from 'chai';
import { fragentize } from './hexler-helper';

describe('stream-payload', () => {

  it('find', (done) => {
    fragentize().forEach((hexle) => {
      hexle.hexle.forEach(fragments => {
        const sp = new StreamPayload('__BEGIN--', '_-END-_');
        let foundIdx = 0;
        fragments.forEach(fragment => {
          sp.feed(fragment, 0, (payload) => assert.equal(hexle.payload[foundIdx++], payload, fragment));
        });
        // assert.equal(hexle.payload.length, foundIdx);
      });
    });
    done();
  });

});
