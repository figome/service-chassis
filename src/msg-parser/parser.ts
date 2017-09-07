
interface Step {
    pos: number;
    step: State;
}

abstract class State {
    public next: State;
    public match: string;

    constructor(match: string) {
        this.match = match;
    }

    public abstract scan(fragment: string, pos: number): Step;

    public action(cb: () => void): State {
        return this;
    }
}

class FirstScanner extends State {

    constructor(match: string) {
        super(match);
    }

    public scan(fragment: string, ofs: number): Step {
        const pos = fragment.indexOf(this.match, ofs);

        if (pos >= 0) {
            return { pos: pos + 1, step: this.next };
        }

        return { pos: fragment.length, step: this };
    }
}

class NextScanner extends State {

    public reset: State;

    constructor(match: string, reset: State) {
        super(match);
        this.reset = reset;
    }

    public scan(fragment: string, ofs: number): Step {

        if (fragment.substr(ofs, 1) === this.match) {
            return { pos: ofs + 1, step: this.next };
        }

        return this.reset.scan(fragment, ofs);
    }
}

class FoundScanner extends State {

    constructor(next: State) {
        super('FoundScanner');
        this.next = next;
    }

    public scan(fragment: string, ofs: number): Step {
        return null;
    }

    public action(cb: () => void): State {
        cb();
        return this.next;
    }
}

class StreamScanner {

    private graph: State;
    public hayStack: string;

    private static buildStateGraph(hayStack: string): State {

        const sarray = hayStack.split('');
        const graph = new FirstScanner(sarray[0]);
        let current: State = graph;

        for (let idx = 1; idx < sarray.length; ++idx) {
            const tmp = new NextScanner(sarray[idx], graph);
            current.next = tmp;
            current = tmp;
        }

        current.next = new FoundScanner(graph);
        return graph;
    }

    constructor(hayStack: string) {
        this.graph = StreamScanner.buildStateGraph(hayStack);
        this.hayStack = hayStack;
    }

    public feed(fragment: string, ofs: number, cb: (fragment: string, ofs: number) => void): void {
        while (ofs < fragment.length) {
            const ret = this.graph.scan(fragment, ofs);
            this.graph = ret.step.action(() => cb(fragment, ret.pos));
            ofs = ret.pos;
        }
    }

}

[
    [''],
    ['', '', '__Juju--', 'found____Juju--', '', ''],
    ['', '', '__Juju-+', '', ''],
    ['', 'm', '_', '_J', 'u', 'ju-', '-', 'found'],
    ['', 'm', '_', '_J', 'u', 'ju-', '+', 'meno'],
    ['meno__Juju--__Juju--found'],
    ['meno__Juju-+meno']
].forEach((elements, index) => {

    console.log(`Creating new graph from stream (${JSON.stringify(elements)})`);
    const s2 = new StreamScanner('__Juju--');

    elements.forEach(fragment => {
        s2.feed(fragment, 0, (f, ofs) => {
            console.log('=> found', f, ofs, f.substr(ofs));
            // if (ofs < f.length) {
            //     console.log('=> FOUND', f, ofs, f.substr(ofs));
            // } else {
            //     console.log('found it', f, ofs, f.substr(ofs));
            // }
        });
    });
});

[
    [
        '', 'm', '_', '_J', 'u', 'ju-', '-', 'found', '__ENDE__',
        '__ENDE__', '_', '_J', 'u', 'ju-', '-', 'found2', '__ENDE__'
    ],
    ['m__Juju--found__ENDE____ENDE____Juju--found2__ENDE__']
].forEach( elements => {

    const initialScanner = new StreamScanner('__Juju--');
    const endScanner = new StreamScanner('__ENDE__');

    let payload: string[] = [];
    let currentScanner = initialScanner;

    elements.forEach(fragment => {
        currentScanner.feed(elements.join(''), 0, function found(f, ofs): void {

            if (currentScanner === initialScanner) {
                endScanner.feed(fragment, ofs, found);
                currentScanner = endScanner;
                payload = [ fragment.substr(ofs) ];
            } else if (currentScanner === endScanner) {
                payload.push(fragment.substr(0, ofs - currentScanner.hayStack.length));
                initialScanner.feed(fragment, ofs, found);
                currentScanner = initialScanner;
                console.log('PAYLAOD:', payload.join(''), '\n');

            }

        });

        if (currentScanner === endScanner) {
            payload.push(fragment);
        }

    });
});
