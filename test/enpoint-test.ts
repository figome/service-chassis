import { assert } from 'chai'
import { Endpoint } from '../src/endpoint'
import MemoryPlugin from '../src/memory-plugin'

describe('Endpoint', () => {
    
    describe('connect', () => {

        it('Can connect', done => {

            const plugin = new MemoryPlugin();
            const instanceLeft = new Endpoint(plugin)
            const instanceRight = new Endpoint(plugin)

            instanceLeft.connect({ channelName: 'channelName' }, endpoint => {
                
                assert.isNull(endpoint)
                
                instanceRight.listen({ channelName: 'channelName' }, endpoint => {

                    assert.isNotNull(endpoint, 'instanceRight listen')

                    instanceLeft.connect({ channelName: 'channelName' }, endpoint => {

                        assert.isNotNull(endpoint, `InstanceLeft connect ${endpoint}`)

                        instanceRight.close(endpoint => {

                            assert.isNotNull(endpoint, 'InstanceRight close')

                            instanceLeft.close(endpoint => {

                                assert.isNotNull(endpoint, 'InstanceLeft close')

                                done()

                            })
                    })

                    })
                })

            })
            
        })

        it('can close connections', done => {

            const plugin = new MemoryPlugin()
            const instance = new Endpoint(plugin)

            instance.close(endpoint => {

                assert.isNull(endpoint);

                instance.listen({ channelName: 'channelName' }, endpoint => {

                    instance.close(endpoint => {

                        assert.isNotNull(endpoint)

                        instance.close(endpoint => {

                            assert.isNull(endpoint)

                            done()

                        })
                    })
                })
            })

        })
    })

    describe('double Connect/listen', () => {

        function test(f1:string, f2:string, cb:any) {

            const plugin = new MemoryPlugin()
            const instance = new Endpoint(plugin)
            const yolo = instance as any;

            yolo[f1]({ channelName: 'channelName' }, (endpoint: Endpoint) => {

                assert.isNotNull(endpoint)

                yolo[f2]({ channelName: 'channelName' }, (endpoint: Endpoint) => {

                    assert.isNull(endpoint)

                    instance.close(cb)

                })

            })
        }

        it('listen:listen', done => {

            const plugin = new MemoryPlugin()
            const instance = new Endpoint(plugin)

            instance.listen({ channelName: 'channelName' }, (endpoint: Endpoint) => {

                assert.isNotNull(endpoint)

                instance.listen({ channelName: 'channelName' }, (endpoint: Endpoint) => {

                    assert.isNull(endpoint)

                    instance.close(endpoint => {

                        assert.isNotNull(endpoint)

                        done()
                    })

                })

            })
        })

        it('listen:connect', done => {
            
            const plugin = new MemoryPlugin()
            const instance = new Endpoint(plugin)

            instance.listen({ channelName: 'channelName' }, (endpoint: Endpoint) => {
                
                assert.isNotNull(endpoint)

                instance.connect({ channelName: 'channelName' }, (endpoint: Endpoint) => {
                    assert.isNull(endpoint)

                    instance.close(endpoint => {

                        assert.isNotNull(endpoint)

                        done()
                    })

                })

            })
        })

        it('connect:listen', done => {
            
            const plugin = new MemoryPlugin()
            const instance = new Endpoint(plugin)

            instance.connect({ channelName: 'channelName' }, (endpoint: Endpoint) => {

                assert.isNull(endpoint, 'instance connect')

                instance.listen({ channelName: 'channelName' }, (endpoint: Endpoint) => {

                    assert.isNotNull(endpoint, 'instance listen after connect')

                    instance.close(endpoint => {

                        assert.isNotNull(endpoint)

                        done()
                    })

                })

            })
        })

        it('connect:connect', done => {
            
            const plugin = new MemoryPlugin()
            const instance = new Endpoint(plugin)

            instance.connect({ channelName: 'channelName' }, (endpoint: Endpoint) => {

                assert.isNull(endpoint, 'instance connect')

                instance.connect({ channelName: 'channelName' }, (endpoint: Endpoint) => {

                    assert.isNull(endpoint, 'instance listen after connect')

                    done()

                })

            })
        })

    })

    describe('send/bind', () => {

        it('cannot send if not connected.', done => {

            const plugin = new MemoryPlugin()
            const instance = new Endpoint(plugin)

            instance.send('TEST', endpoint => {

                assert.isNull(endpoint)
                done()

            })

        })

        it('can send if connected.', done => {

            const plugin = new MemoryPlugin()
            const server = new Endpoint(plugin)

            server.listen({ channelName: 'channelName' }, endpoint => {

                server.send('TEST', endpoint => {

                    assert.isNull(endpoint)

                    server.close(endpoint => {

                        assert.isNotNull(endpoint)
                        done()

                    })

                })
            })
        })

        it('can send to client and receive call back.', done => {

            const plugin = new MemoryPlugin();
            const server = new Endpoint(plugin);
            const client = new Endpoint(plugin);

            server.listen({ channelName: 'server' }, endpoint => {

                assert.isNotNull(endpoint)

                client.connect({ channelName: 'server' }, endpoint => {

                    assert.isNotNull(endpoint)

                    client.bind(msg => {

                        assert.equal(msg, 'TEST')

                        client.send('GOTCHA', endpoint => {

                            assert.isNotNull(endpoint)

                        })

                    })

                    server.bind( msg => {

                        assert.equal(msg, 'GOTCHA')

                        server.close(endpoint => {

                            assert.isNotNull(endpoint, 'server close')

                            client.close (endpoint => {

                                assert.isNotNull(endpoint, 'client close')
                                done()
                                
                            })
                        })
                    })

                    server.send('TEST', endpoint => {

                        assert.isNotNull(endpoint)

                    })
                })
            })

        })
    })
})

