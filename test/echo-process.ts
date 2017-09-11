import StdInOutEndpoint from '../my/std-in-out-endpoint';

const sioep = new StdInOutEndpoint();

sioep.input.subscribe((data: string) => {
    sioep.output.next(data);
});
