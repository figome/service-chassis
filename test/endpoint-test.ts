import { assert } from 'chai';
import MemoryEndpoint from '../src/memory-endpoint';
import * as rx from 'rxjs';


    describe(`Endpoint:`, () => {
        before(done => {
            done();
        });

        it('client to server', done => {
            const mep = new MemoryEndpoint();
            const server = mep.listen('cName');
            const client = mep.connect('cName');
            server.input.subscribe((data: any) => {
                assert.equal('CTS', data);
            }, () => {
                assert.fail();
            }, () => {
                done();
            });
            client.output.next('CTS');
            client.output.complete();
        });

        it('echo it', done => {
            const mep = new MemoryEndpoint();
            const server = mep.listen('cName');
            const client = mep.connect('cName');

            server.input.subscribe((data: any) => {
                assert.equal('PING', data);
                server.output.next(data);
            });
            client.input.subscribe(
                (data: any) => { assert.equal('PING', data); },
                () => { /* */ },
                () => { done(); });
            client.output.next('PING');
            client.output.complete();
        });

        it('server to client', done => {
            const mep = new MemoryEndpoint();
            const server = mep.listen('cName');
            const client = mep.connect('cName');
            client.input.subscribe(
                (data: any) => { assert.equal('PONG', data); },
                () => { /* */ },
                () => { done(); });
            server.output.next('PONG');
            server.output.complete();

        });
    });
