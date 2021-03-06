import * as rx from 'rxjs';
import StdInOutEndpoint from '../src/std-in-out-endpoint';


const sioep = new StdInOutEndpoint();

sioep.input.subscribe((data: string) => {
    if (data.indexOf('__BEG__CORE__END__') >= 0) {
        process.exit(66);
    } else {
        sioep.output.next(data);
    }
});
