import { assert } from 'chai';
import MemoryEndpoint from '../src/memory-endpoint';

describe('Endpoint memory (communication)', () => {

    it('client -> server', done => {

        const memEp = new MemoryEndpoint();
        const server = memEp.listen('cName');
        const client = memEp.connect('cName');

        server.input.subscribe(
            (data: any) => { assert.equal('CTS', data); },
            () => { assert.fail(); },
            () => { done(); }
        );

        client.output.next('CTS');
        client.output.complete();

    });

    it('server -> client', done => {

        const memEp = new MemoryEndpoint();
        const server = memEp.listen('cName');
        const client = memEp.connect('cName');

        client.input.subscribe(
            (data: any) => { assert.equal('PONG', data); },
            () => { assert.fail(); },
            () => { done(); }
        );

        server.output.next('PONG');
        server.output.complete();

    });

    it('(echo) client -> server -> client', done => {

        const memEp = new MemoryEndpoint();
        const server = memEp.listen('cName');
        const client = memEp.connect('cName');

        server.input.subscribe((data: any) => {
            assert.equal('PING', data);
            server.output.next(data);
        });

        client.input.subscribe(
            (data: any) => { assert.equal('PING', data); },
            () => { assert.fail(); },
            () => { done(); }
        );

        client.output.next('PING');
        client.output.complete();

    });
});
