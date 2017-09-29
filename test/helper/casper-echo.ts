
declare function require(name: string): any;

import * as rx from 'rxjs';
import FirstLastEndpoint from '../../src/first-last-endpoint';
import CasperjsBinding from '../../src/casperjs-binding';

const casper = require('casper').create();

if (casper.cli.options.http_server) {
    const casperEp = new CasperjsBinding(casper.cli.options.http_server);
    const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', casperEp);

    if (casperEp.listening) {
        flep.output.next('/startedServer');
    } else {
        flep.output.next('/failedToStartServer');
    }

    flep.input.subscribe(data => {

        if (data == '/shutdown') {
            flep.output.next('/casperDone');
            return;
        }

        flep.output.next(data);
    });
}
