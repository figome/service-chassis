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
        this.output.subscribe(
            (data) => {
                down.output.next(`${this.payloadParser.first}${data}${this.payloadParser.last}`);
            },
            (error) => {
                down.output.error(error);
            },
            () => {
                down.output.complete();
            });
        this.input = new rx.Subject();
        down.input.subscribe(
            data => {
                this.payloadParser.feed(data, 0, (payload) => {
                    this.input.next(payload);
                });
            },
            (error) => {
                this.input.error(error);
            },
            () => {
                this.input.complete();
            });
    }

}

export default FindLastEndpoint;
