
declare function require(name: string): any;

const casper = require('casper').create();

import * as rx from 'rxjs';
import FirstLastEndpoint from '../src/first-last-endpoint';
import CasperjsBinding from '../src/casperjs-binding';

if (casper.cli.options.http_server) {
    const casperEp = new CasperjsBinding(casper.cli.options.http_server);
    console.log('started casperjs webserver');
    const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', casperEp);
    flep.input.subscribe((data) => {
        flep.output.next(data);
        if (data == '/shutdown') {
            casper.exit(0);
        }
    });
    flep.output.next('/started');
}
