/*
 * INTERFACES
 */
export interface Callback<P> {
    (endpoint?: ServiceChassis<P>): void;
}

export interface ReadCallback<P> {
    (data: any, endpoint: ServiceChassis<P>): void;
}

export interface BindCallback {
    (data: any, status?: number, signal?: string): void;
}

export interface DataCallback {
    (data: any): void;
}

export abstract class Plugin<P> {
    public abstract listen(param: P, endpoint: ServiceChassis<P>, cb: Callback<P>): void;
    public abstract connect(param: P, endpoint: ServiceChassis<P>, cb: Callback<P>): void;
    public abstract close(param: P, endpoint: ServiceChassis<P>, cb: Callback<P>): void;
    public write(data: any, cb: DataCallback): void {
        cb(data);
    }
    public abstract feed(data: any, endpoint: ServiceChassis<P>, cb: Callback<P>): void;
}

export default interface ServiceChassis<P> {

    connectionParams: P;
    bounded: BindCallback[];
    boundedError: ((data: any) => void)[];

    listen(param: P, cb: Callback<P>): ServiceChassis<P>;
    connect(param: P, cb: Callback<P>): ServiceChassis<P>;
    close(cb: Callback<P>): void;
    bind(cb: BindCallback, errCb: (data: any) => void): void;
    write(data: any, cb: Callback<P>): void;
    feed(data: any, cb: Callback<P>): void;
    gulp(data: any, cb: Callback<P>): void;

}
