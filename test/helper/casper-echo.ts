
declare function require(name: string): any;

import FirstLastEndpoint from '../../src/first-last-endpoint';
import CasperjsBinding from '../../src/casperjs-binding';

const casper = require('casper').create();

if (casper.cli.options.http_server) {
    const casperEp = new CasperjsBinding(casper.cli.options.http_server, casper);
    const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', casperEp);

    if (casperEp.listening) {

        flep.output.next('/startedServer');

        flep.input.subscribe(
            data => {
                switch (data) {
                    case '/shutdown':
                        flep.output.complete();
                        break;
                    case '/provokeEndpointError':
                        flep.output.error('/endpointError');
                        break;
                    default:
                        flep.output.next(data);
                }

            }
        );

    } else {

        flep.output.error('/failedToStartServer');

    }

}
