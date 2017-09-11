import { assert } from 'chai';
import MemoryEndpoint from '../src/memory-endpoint';

// import ServiceChassis from '../src/endpoint';
// import MemoryPlugin from '../src/plugins/memory-plugin';

describe('Endpoint', () => {
    // describe('connect', () => {

    // it('Can connect', done => {

    //     const plugin = new MemoryPlugin();
    //     const instanceLeft = new ServiceChassis(plugin);
    //     const instanceRight = new ServiceChassis(plugin);

    //     instanceLeft.connect({ channelName: 'channelName' }, endpoint => {
    //         assert.isNull(endpoint);
    //         instanceRight.listen({ channelName: 'channelName' }, leftListenEndpoint => {

    //             assert.isNotNull(leftListenEndpoint, 'instanceRight listen');

    //             instanceLeft.connect({ channelName: 'channelName' }, leftConnectEndpoint => {

    //                 assert.isNotNull(leftConnectEndpoint, `InstanceLeft connect ${endpoint}`);

    //                 instanceRight.close(rightCloseEndpoint => {

    //                     assert.isNotNull(rightCloseEndpoint, 'InstanceRight close');

    //                     instanceLeft.close(leftCloseEndpoint => {

    //                         assert.isNotNull(leftCloseEndpoint, 'InstanceLeft close');

    //                         done();

    //                     });
    //                 });
    //             });
    //         });
    //     });
    // });

    //     it('can close connections', done => {

    //         const plugin = new MemoryPlugin();
    //         const instance = new ServiceChassis(plugin);

    //         instance.close(endpoint => {

    //             assert.isNull(endpoint);

    //             instance.listen({ channelName: 'channelName' }, listenEndpoint => {

    //                 assert.isNotNull(listenEndpoint);

    //                 instance.close(closeEndpoint => {

    //                     assert.isNotNull(closeEndpoint);

    //                     instance.close(secondCloseEndpoint => {

    //                         assert.isNull(secondCloseEndpoint);

    //                         done();

    //                     });
    //                 });
    //             });
    //         });
    //     });
    // });

    // describe('double Connect/listen', () => {
    //     it('listen:listen', done => {

    //         const plugin = new MemoryPlugin();
    //         const instance = new ServiceChassis(plugin);

    //         instance.listen({ channelName: 'channelName' }, listenEndpoint => {

    //             assert.isNotNull(listenEndpoint);

    //             instance.listen({ channelName: 'channelName' }, secondListenEndpoint => {

    //                 assert.isNull(secondListenEndpoint);

    //                 instance.close(closeEndpoint => {

    //                     assert.isNotNull(closeEndpoint);

    //                     done();
    //                 });

    //             });

    //         });
    //     });

    //     it('listen:connect', done => {

    //         const plugin = new MemoryPlugin();
    //         const instance = new ServiceChassis(plugin);

    //         instance.listen({ channelName: 'channelName' }, listenEndpoint => {

    //             assert.isNotNull(listenEndpoint);

    //             instance.connect({ channelName: 'channelName' }, connectEndpoint => {

    //                 assert.isNull(connectEndpoint);

    //                 instance.close(closeEndpoint => {

    //                     assert.isNotNull(closeEndpoint);

    //                     done();
    //                 });

    //             });

    //         });
    //     });

    //     it('connect:listen', done => {

    //         const plugin = new MemoryPlugin();
    //         const instance = new ServiceChassis(plugin);

    //         instance.connect({ channelName: 'channelName' }, connectEndpoint => {

    //             assert.isNull(connectEndpoint, 'instance connect');

    //             instance.listen({ channelName: 'channelName' }, listenEndpoint => {

    //                 assert.isNotNull(listenEndpoint, 'instance listen after connect');

    //                 instance.close(closeEndpoint => {

    //                     assert.isNotNull(closeEndpoint);

    //                     done();
    //                 });

    //             });

    //         });
    //     });

    //     it('connect:connect', done => {

    //         const plugin = new MemoryPlugin();
    //         const instance = new ServiceChassis(plugin);

    //         instance.connect({ channelName: 'channelName' }, connectEndpoint => {

    //             assert.isNull(connectEndpoint, 'instance connect');

    //             instance.connect({ channelName: 'channelName' }, secondConnectEndpoint => {

    //                 assert.isNull(secondConnectEndpoint, 'instance listen after connect');

    //                 done();

    //             });

    //         });
    //     });

    // });


    // it('cannot send if not connected.', done => {

    //     const plugin = new MemoryEndpoint();

    //     instance.write('TEST', endpoint => {

    //         assert.isNull(endpoint);
    //         done();

    //     });

    // });

    // it('can send if connected.', done => {

    //     const plugin = new MemoryPlugin();
    //     const server = new ServiceChassis(plugin);

    //     server.listen({ channelName: 'channelName' }, endpoint => {

    //         server.write('TEST', sendEndpoint => {

    //             assert.isNull(sendEndpoint);

    //             server.close(closeEndpoint => {

    //                 assert.isNotNull(closeEndpoint);
    //                 done();

    //             });

    //         });
    //     });
    // });

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
