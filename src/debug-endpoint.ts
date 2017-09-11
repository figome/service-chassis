
import * as rx from './urxjs';
import PayloadParser from './payload-parser';

export class DebugEndpoint extends rx.Subject<any> {
    private attached: rx.Subject<any>;

    public static attach<T>(attach: rx.Subject<T>): DebugEndpoint {
        const dep = new DebugEndpoint();
        dep.attached = attach;
        return dep;
    }

    // public subscribe(): rx.Subscription {
    //     return this.attached.subscribe();
    // }
    // public subscribe(observer: rx.PartialObserver<any>): rx.Subscription {
    //     return this.attached.subscribe(observer);
    // }
    // subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription;

    // public subscribe(next?: (data: any) => void, error?: (error: any) => void,
    //     complete?: () => void): rx.Subscription {
    //     return this.attached.subscribe((data: any) => {
    //         console.log(`DebugEndpoint:subscribe:cb:[${data}]`);
    //         next(data);
    //     }, (data: any) => {
    //         if (error) {
    //             console.log(`DebugEndpoint:subscribe:error:[${data}]`);
    //             error(data);
    //         }
    //     }, () => {
    //         if (complete) {
    //             console.log(`DebugEndpoint:subscribe:complete:`);
    //             complete();
    //         }
    //     });
    // }

    public next(data: string): void {
        console.log(`DebugEndpoint:next:[${data}]`);
        this.attached.next(data);
    }

    public complete(): void {
        console.log('DebugEndpoint:complete');
        this.attached.complete();
    }
}

export default DebugEndpoint;
