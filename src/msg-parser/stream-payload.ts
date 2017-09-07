
import StreamScanner from './stream-scanner';

interface Step {
    pos: number;
    step: State;
}
interface StepCB {
    (step: Step): void;
}

interface StringPos {
    start?: number;
    end?: number;
    str: string;
}
class FragBuffer {
    public frags: StringPos[] = null;
    public match: string;
    constructor(match: string) {
        this.match = match;
    }
    public toString(): string {
        const ret = this.frags.map((sp: StringPos) => {
            if (sp.end === undefined) {
                return sp.str.substr(sp.start);
            }
            return sp.str.substring(sp.start, sp.end);
        }).join('');
        return ret.substr(0, (ret.length - this.match.length) + 1);
    }
}

export abstract class State {
    public next: State;
    public match: string;

    constructor(match: string) {
        this.match = match;
    }

    public abstract feed(fragment: string, pos: number): Step;

    public action(cb: () => void): State {
        return this;
    }
}

abstract class Scanner extends State {

    private streamScanner: StreamScanner;
    protected fragBuffer: FragBuffer;

    constructor(match: string, fb: FragBuffer) {
        super(match);
        this.streamScanner = new StreamScanner(match);
        this.fragBuffer = fb;
    }

    protected _feed(fragment: string, ofs: number, cb: (ofs: number) => void): Step {
        // console.log('feed:', this.match, fragment, ofs);
        let next: Step = null;
        while (ofs < fragment.length) {
            const ret = this.streamScanner.findNext(fragment, ofs,
                (_fragment: string, pos: number) => {
                // console.log('findNext', this.match, fragment.substr(ofs), this.next.match);
                cb(ofs);
                next = { pos: pos, step: this.next };
            });
            if (next) {
                return next;
            }
            ofs = ret.pos;
        }
        return { pos: fragment.length, step: this };
    }
}

class FirstScanner extends Scanner {
    public feed(fragment: string, ofs: number): Step {
        return super._feed(fragment, ofs, (_ofs: number) => {
            this.fragBuffer.frags = [ ];
        });
    }
}

class LastScanner extends Scanner {
    public feed(fragment: string, ofs: number): Step {
        const sPos: StringPos = {start: ofs, str: fragment};
        this.fragBuffer.frags.push(sPos);
        return super._feed(fragment, ofs, (_ofs: number) => {
            sPos.end = _ofs;
        });
    }
}

class FoundScanner extends State {

    constructor() {
        super('FoundScanner');
    }

    public feed(fragment: string, ofs: number): Step {
        return null;
    }

    public action(cb: () => void): State {
        cb();
        return this.next;
    }
}

class StreamPlayload {
    private graph: State;
    public first: string;
    public last: string;
    public fragBuffer: FragBuffer;

    private static buildStateGraph(first: string, last: string, fragBuffer: FragBuffer): State {
        const graph = new FirstScanner(first, fragBuffer);
        let _first: State = graph;

        const _last = new LastScanner(last, fragBuffer);
        _first.next = _last;

        const foundScanner = new FoundScanner();
        _last.next = foundScanner;
        foundScanner.next = graph;
        return graph;
    }

    constructor(first: string, last: string) {
        this.first = first;
        this.last = last;
        this.fragBuffer = new FragBuffer(last);
        this.graph = StreamPlayload.buildStateGraph(first, last, this.fragBuffer);
    }

    public feed(fragment: string, ofs: number, cb: (fragment: string, ofs: number) => void): void {
        // if (fragment.length > 9) {
        //     console.log('process:', fragment);
        // } else {
        //     return;
        // }
        while (ofs < fragment.length) {
            // console.log('current-enter', this.graph.match, fragment.substr(ofs), ofs);
            const next = this.graph.feed(fragment, ofs);
            this.graph = next.step;
            this.graph = this.graph.action(() => {
                 console.log('found payload', this.fragBuffer.toString());
            });
            ofs = next.pos;
            // console.log('current-leave', this.graph.match, fragment.substr(ofs), ofs);
            /*
            while (ofs < fragment.length) {
                const ret = this.graph.scan(fragment, ofs);
                this.graph = ret.step.action(() => cb(fragment, ret.pos));
                ofs = ret.pos;
            }
            */
        }
    }

}

export default StreamPlayload;

// // [
// //     [''],
// //     ['', '', '__Juju--', 'found____Juju--', '', ''],
// //     ['', '', '__Juju-+', '', ''],
// //     ['', 'm', '_', '_J', 'u', 'ju-', '-', 'found'],
// //     ['', 'm', '_', '_J', 'u', 'ju-', '+', 'meno'],
// //     ['meno__Juju--__Juju--found'],
// //     ['meno__Juju-+meno']
// // ].forEach((elements, index) => {

// //     console.log(`Creating new graph from stream (${JSON.stringify(elements)})`);
// //     const s2 = new StreamScanner('__Juju--');

// //     elements.forEach(fragment => {
// //         s2.feed(fragment, 0, (f, ofs) => {
// //             console.log('=> found', f, ofs, f.substr(ofs));
// //             // if (ofs < f.length) {
// //             //     console.log('=> FOUND', f, ofs, f.substr(ofs));
// //             // } else {
// //             //     console.log('found it', f, ofs, f.substr(ofs));
// //             // }
// //         });
// //     });
// // });

// [
//     // ['', 'm', '_', '_J', 'u', 'ju-', '-', 'found', '__ENDE__',
//     // '__ENDE__', '_', '_J', 'u', 'ju-', '-', 'found2', '__ENDE__'],
//     ['m__Juju--found__ENDE____ENDE____Juju--found2__ENDE__']
// ].forEach(elements => {

//     const initialScanner = new StreamScanner('__Juju--');
//     const endScanner = new StreamScanner('__ENDE__');

//     let payload: string[] = [];
//     // let offset = 0;
//     let currentScanner = initialScanner;

//     // function found(f: string, ofs: number): void {
//     //     console.log(currentScanner.hayStack, ofs, ' => ', f);
//     // }

//     console.log();

//     initialScanner.feed(elements.join(''), 0, function found(f, ofs): void {

//         console.log(currentScanner.hayStack, ofs, ' => ', f);

//         if (currentScanner === initialScanner) {
//             currentScanner = endScanner;
//         } else {
//             console.log('PAYLOAD:', f.substr(0, ofs - currentScanner.hayStack.length), '\n');
//             currentScanner = initialScanner;
//         }

//         currentScanner.feed(f.substr(ofs), 0, found);

//     });

//     // elements.forEach(fragment => {
//     // currentScanner.feed(elements.join(''), 0, function found(f, ofs): void {

//     // if (currentScanner === initialScanner) {
//     //     endScanner.feed(fragment, ofs, found);
//     //     currentScanner = endScanner;
//     //     payload = [ fragment.substr(ofs) ];
//     // } else if (currentScanner === endScanner) {
//     //     payload.push(fragment.substr(0, ofs - currentScanner.hayStack.length));
//     //     initialScanner.feed(fragment, ofs, found);
//     //     currentScanner = initialScanner;
//     //     console.log('PAYLAOD:', payload.join(''), '\n');

//     // }

//     // });

//     // if (currentScanner === endScanner) {
//     //     payload.push(fragment);
//     // }

//     // });
// });
