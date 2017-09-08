import ServiceChassis, { Plugin, Callback, BindCallback, ReadCallback } from '../service-chassis';
import StreamScanner from './stream-payload';

export interface Param {}

export class Message {

    private sepStart: Buffer;
    private sepEnd: Buffer;
    private messageBuffer: (string|Buffer)[];

    constructor(sepStart: string, sepEnd?: string) {
        this.sepStart = Buffer.from(sepStart);
        this.sepEnd = Buffer.from(sepEnd || sepStart);
        this.messageBuffer = [];
    }

    public encapsulate(message: string): string {
        return Buffer.concat([
            this.sepStart,
            Buffer.from(message),
            this.sepEnd
        ]).toString('utf8');
    }

    public add(data: string, endpoint: ServiceChassis<Param>, cb: ReadCallback<Param>): void {
        this.messageBuffer.push(data);
        console.log('PARSER:', test);
    }
}
