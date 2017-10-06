
declare function require(name: string): any;

import FirstLastEndpoint from '../../src/first-last-endpoint';
import CasperjsBinding from '../../src/casperjs-binding';

const casper = require('casper').create();

if (casper.cli.options.http_server) {
    const casperEp = new CasperjsBinding(casper.cli.options.http_server);
    const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', casperEp);

    if (casperEp.listening) {

        flep.output.next('/startedServer');

        flep.input.subscribe(
            data => {
                switch (data) {
                    case '/shutdown':
                        casper.exit();
                        casper.bypass(1);
                        break;
                    case '/provokeEndpointError':
                        flep.output.error('/endpointError');
                        break;
                    case '/provokeThrow':
                        throw new Error('/provokedThrow');
                    default:
                        flep.output.next(data);
                }

            }
        );

    } else {

        flep.output.error('/failedToStartServer');
        casper.exit(1);
        casper.bypass(1);

    }

}
