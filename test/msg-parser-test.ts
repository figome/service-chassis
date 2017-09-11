import { assert } from 'chai';
// import * as path from 'path';

// // import Endpoint from '../src/endpoint';
// // import NestedEndpoint from '../src/nested-endpoint';

// // import { Message } from '../src/msg-parser/message';
 import ExecEndpoint from '../my/exec-endpoint';
 import FirstLastEndpoint from '../my/first-last-endpoint';
 import * as path from 'path';

// import ReflectorPlugin from '../src/plugins/reflector-plugin';
// import PayloadParserPlugin from '../src/plugins/payload-parser-plugin';
// import PayloadParser from '../my/payload-parser';
// import DebugPlugin from '../my/debug-endpoint';

describe('first-last messages', () => {
    it('', done => {
        const eep = ExecEndpoint.command(process.execPath,
            [path.join('dist', 'test', 'echo-process.js')]);
        const flep = new FirstLastEndpoint('__BEG__', '__END__', eep);

        let count = 0;
        flep.input.subscribe(
            (data) => { ++count; assert.equal('Hello World', data); },
            (error) => { assert.fail(); },
            () => { assert.equal(count, 4); done(); });
        flep.output.next('Hello World');
        flep.output.next('Hello World');
        flep.output.next('Hello World');
        flep.output.next('Hello World');
        flep.output.complete();
    });

//         it('encapsulates a given message with a separator, even if empty.', done => {
//             const separator = '__SEP__';
//             const message = new Message(separator);
//             const testDataWithoutData = '';

//             assert.equal(
//                 message.encapsulate(testDataWithoutData),
//                 `${separator}${testDataWithoutData}${separator}`
//             );
//             done();
//         });

//     });

//     describe('read', () => {

//         it('...', done => {
//             const execPlugin = new ExecPlugin();
//             const reflectorPlugin = new ReflectorPlugin();

//             const execInstance = new Endpoint(execPlugin);
//             const simpleInstance = new Endpoint(reflectorPlugin);

//             const pp = new PayloadParser('__SEP__', '__SEP__');
//             const testMessage = 'testMessage';

//             simpleInstance.connect({ channelName: 'test'}, () => {/**/});

//             execInstance.connect({
//                 command: process.execPath,
//                 argv: [ '-e', `console.log("__SEP__${testMessage}__SEP__")` ]
//             }, serverEndpoint => {/**/});

//             execInstance.read(data => {
//                 if (data) {
//                     pp.feed(data.toString('utf8'), 0, (payload) => {
//                         simpleInstance.write(payload, () => {/**/});
//                     });
//                 }
//             });

//             simpleInstance.read(data => {
//                 assert.equal(data, testMessage);
//                 done();
//             });

//         });

//     });

//     describe('nested chassis', () => {
//         it('can nest endpoints', done => {

//             const testMessage = 'testMessage';
//             const execPlugin = new ExecPlugin();
//             const execService = new Endpoint(execPlugin).connect({
//                 command: process.execPath,
//                 argv: [ path.join('dist', 'test', '_test-subProcess') ]
//             }, serverEndpoint => {/**/});

//             const debugPlugin = new DebugPlugin();
//             const debugService = new NestedEndpoint(debugPlugin, null, execService);

//             const payloadParserPlugin = new PayloadParserPlugin('__SEP__', '__SEP__');
//             const payloadService = new NestedEndpoint(payloadParserPlugin, null, debugService)
//                 .connect({}, () => {/**/});

//             payloadService.bind(data => {
//                 assert.equal(data, testMessage);
//                 done();
//             }, null);

//             payloadService.write('test', (data) => {
//                 console.log('DATA', data);
//             });
//         });
//     });
});
