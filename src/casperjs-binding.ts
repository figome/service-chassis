import * as rx from 'rxjs';

// const casper = require('casper');

export class CasperjsBinding {

    public input: rx.Subject<string>;
    public output: rx.Subject<string>;
    public listening: any;

    constructor(listenAdr: string) {
        this.input = new rx.Subject();
        this.output = new rx.Subject();

        // write "output" to stdout
        this.output.subscribe(output => console.log(output));

        const server = require('webserver').create();

        this.listening = server.listen(listenAdr, (request: any, response: any) => {
            // consume input via HTTP request
            try {
                this.input.next(request.postRaw);
            } catch (e) {
                this.output.next('/error' + e);
            } finally {
                response.statusCode = 200;
                response.write('<html><body>casper theater</body></html>');
                response.close();
            }
        });
    }

}

export default CasperjsBinding;
