import * as rx from 'rxjs';

const system = require('system');

export class CasperjsBinding {

    private casper: any;
    public input: rx.Subject<string>;
    public output: rx.Subject<string>;
    public listening: any;

    constructor(listenAdr: string, casper: any) {
        this.input = new rx.Subject();
        this.output = new rx.Subject();
        this.casper = casper;

        // write "output" to stdout
        this.output.subscribe(
            data => {
                console.log(data);
            },
            err => {
                system.stderr.write(err);
                this.casper.exit(1);
                this.casper.bypass(1);
            },
            () => {
                this.casper.exit();
                this.casper.bypass(1);
            }
        );

        const server = require('webserver').create();

        this.listening = server.listen(listenAdr, (request: any, response: any) => {
            // consume input via HTTP request
            this.input.next(request.postRaw);

            response.statusCode = 200;
            response.write('<html><body>casper theater</body></html>');
            response.close();
        });
    }

}

export default CasperjsBinding;
