import * as rx from './urxjs';
import RxEndpoint from './rx-endpoint';
import PayloadParser from './payload-parser';

export function FindLastEndpoint(first: string, last: string): RxEndpoint {
    const payLoadParser = new PayloadParser(first, last);
    return new RxEndpoint()
        .send((data: any, rxs: rx.Subject<any>) => {
            payLoadParser.feed(data, 0, (payload) => {
                rxs.next(payload);
            });
        })
        .recv((data: any, rxs: rx.Subject<any>) => {
            rxs.next(`${payLoadParser.first}${data}${payLoadParser.last}`);
        });
}

export default FindLastEndpoint;
