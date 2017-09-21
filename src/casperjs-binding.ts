import * as rx from './abstract-rx';

export class CasperjsBinding {

    public input: rx.Subject<string>;
    public output: rx.Subject<string>;

    constructor(listenAdr: string) {
        this.input = new rx.Subject();
        const server = require('webserver').create();
        server.listen(listenAdr, (request: any, response: any) => {
            this.input.next(request.postRaw);
            response.statusCode = 200;
            response.write('<html><body>casper theater</body></html>');
            response.close();
        });
        this.output = new rx.Subject();
        this.output.subscribe((a) => console.log(a));
    }

}

export default CasperjsBinding;
