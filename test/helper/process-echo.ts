import StdInOutEndpoint from '../../src/std-in-out-endpoint';

const sioEp = new StdInOutEndpoint();

sioEp.input.subscribe((data: string) => {
    if (data.indexOf('__BEG__CORE__END__') >= 0) {
        process.exit(66);
    } else {
        sioEp.output.next(data);
    }
});
