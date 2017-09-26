
declare function require(name: string): any;

const casper = require('casper').create();

import * as rx from 'rxjs';
import FirstLastEndpoint from '../src/first-last-endpoint';
import CasperjsBinding from '../src/casperjs-binding';
import CasperMsg from '../src/casper-msg';

if (casper.cli.options.http_server) {
  setTimeout(() => {
    const casperEp = new CasperjsBinding(casper.cli.options.http_server);
    console.log('started casperjs webserver');
    // const flep = new FirstLastEndpoint('_mi8o_', '_mi8o_', casperEp);
    casperEp.input.subscribe((data) => {
        console.log('casperjs:', JSON.stringify(data.toObject()));
        casperEp.output.next(data);
        data.res.statusCode = 200;
        data.res.write(CasperMsg.create('/respond', data.toObject()));
        data.res.close();
        if (data.url == '/shutdown') {
            casper.exit(0);
        }
    });
    casperEp.output.next(CasperMsg.create<void>('/started'));
  }, 400);
}
