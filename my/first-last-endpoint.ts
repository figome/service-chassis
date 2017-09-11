import * as rx from 'rxjs';
import PayloadParser from './payload-parser';
import RxEndpoint from './rx-endpoint';

export class FindLastEndpoint implements RxEndpoint<string> {

    private payloadParser: PayloadParser;
    public input: rx.Subject<string>;
    public output: rx.Subject<string>;

    constructor(first: string, last: string, down: RxEndpoint<string>) {
        this.payloadParser = new PayloadParser(first, last);
        this.output = new rx.Subject();
        this.output.subscribe((data) => {
            console.log('down.output:', data);
            down.output.next(`${this.payloadParser.first}${data}${this.payloadParser.last}`);
        });
        this.input = new rx.Subject();
        down.input.subscribe(data => {
            console.log('down.input:', data);
            this.payloadParser.feed(data, 0, (payload) => {
                 this.input.next(payload);
            });
        });
    }

}

export default FindLastEndpoint;
