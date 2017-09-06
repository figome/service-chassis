import ServiceChassis, { Plugin, Callback, BindCallback, ReadCallback } from './endpoint';

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

export interface Param {}

export default class MessageParserPlugin extends Plugin<Param> {

    private message: Message;
    private plugin: any;

    constructor(plugin: Plugin<Param>, sepStart: string, sepEnd?: string) {
        super();
        this.plugin = plugin;
        this.message = new Message(sepStart, sepEnd);
    }

    public listen(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        this.plugin.listen(param, endpoint, cb);
    }

    public connect(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        this.plugin.connect(param, endpoint, cb);
    }

    public close(param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        this.plugin.close(param, endpoint, cb);
    }

    public read(data: any, endpoint: ServiceChassis<Param>, cb: ReadCallback<Param>): void {

        this.message.add(data, endpoint, cb);
    }

    public write(data: any, param: Param, endpoint: ServiceChassis<Param>, cb: Callback<Param>): void {
        this.plugin.write(this.message.encapsulate(data), endpoint, cb);
    }
}
