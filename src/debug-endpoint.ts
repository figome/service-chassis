import * as rx from './abstract-rx';

export class DebugEndpoint extends rx.Subject<any> {
    private attached: rx.Subject<any>;

    public static attach<T>(attach: rx.Subject<T>): DebugEndpoint {
        const dep = new DebugEndpoint();
        dep.attached = attach;
        return dep;
    }

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
