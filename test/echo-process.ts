import StdInOutEndpoint from '../my/std-in-out-endpoint';

const sioep = new StdInOutEndpoint();

sioep.input.subscribe((data: string) => {
    if (data.indexOf('__BEG__CORE__END__') >= 0) {
        process.exit(66);
    } else {
        sioep.output.next(data + 'WIRD');
    }
});
