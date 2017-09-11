import * as rx from '../src/abstract-rx';
import StdInOutEndpoint from '../src/std-in-out-endpoint';

rx.inject();

const sioep = new StdInOutEndpoint();

sioep.input.subscribe((data: string) => {
    if (data.indexOf('__BEG__CORE__END__') >= 0) {
        process.exit(66);
    } else {
        sioep.output.next(data);
    }
});
