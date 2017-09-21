
declare function require(name: string): any;

const casper = require('casper').create();

import * as rx from '../src/abstract-rx';
import FirstLastEndpoint from '../src/first-last-endpoint';
import CasperjsBinding from '../src/casperjs-binding';

rx.inject();

if (casper.cli.options.http_server) {
    const casperEp = new CasperjsBinding(casper.cli.options.http_server);
    const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', casperEp);
    flep.input.subscribe((data) => {
        flep.output.next(data);
        if (data == '/shutdown') {
            casper.exit(0);
        }
    });
    flep.output.next('/started');
}
