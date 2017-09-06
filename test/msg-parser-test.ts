import { assert } from 'chai';

import MessageParserPlugin, { Message } from '../src/msg-parser';
import ExecPlugin from '../src/plugins/exec-plugin';
import ServiceChassis from '../src/endpoint';

describe('message parser', () => {
    describe('write', () => {
        it('encapsulates a given message with a separator.', done => {
            const separator = '__SEP__';
            const message = new Message(separator);
            const testDataWithData = 'someData';

            assert.equal(
                message.encapsulate(testDataWithData),
                `${separator}${testDataWithData}${separator}`
            );
            done();
        });

        it('encapsulates a given message with a separator, even if empty.', done => {
            const separator = '__SEP__';
            const message = new Message(separator);
            const testDataWithoutData = '';

            assert.equal(
                message.encapsulate(testDataWithoutData),
                `${separator}${testDataWithoutData}${separator}`
            );
            done();
        });

    });

    describe('read', () => {
        it.only('can identify a message body encapsulated within a separator.', done => {

            function flatten<T> (arr: T[][]): T[] {
                return Array.prototype.concat(...arr);
            }

            const plugin = new ExecPlugin();
            const msgPlugin = new MessageParserPlugin(plugin, '__SEP__');
            const server = new ServiceChassis(plugin);

            const testMessage = 'testMessage';

            server.read(data => {
                console.log('FROM TEST:', data);
            }, data => {
                assert.fail();
                done();
            });

            server.connect({
                command: process.execPath,
                argv: [ '-e', `console.log(__SEP__${testMessage}__SEP__))` ]
            }, endpoint => {/**/});
        });

        it('is able to identify a separator spread over multiple messages.', done => {
            done();
        });
    });
});
