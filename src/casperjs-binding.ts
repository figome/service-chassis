import * as rx from 'rxjs';

export class CasperjsBinding {

    public input: rx.Subject<string>;
    public output: rx.Subject<string>;

    constructor(listenAdr: string) {
        this.input = new rx.Subject();
        const server = require('webserver').create();
        server.listen(listenAdr, (request: any, response: any) => {
            try {
            console.log('Listen-1', request.postRaw);
            this.input.next(request.postRaw);
            console.log('Listen-2');
            } catch (e) {
                console.log('Listen-6:', e);
            } finally {
            response.statusCode = 200;
            console.log('Listen-3');
            response.write('<html><body>casper theater</body></html>');
            console.log('Listen-4');
            response.close();
            console.log('Listen-5');
            }
        });
        this.output = new rx.Subject();
        this.output.subscribe((a) => console.log(a));
    }

}

export default CasperjsBinding;
