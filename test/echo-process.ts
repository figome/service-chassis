import StdInOutEndpoint from '../my/std-in-out-endpoint';

const sioep = StdInOutEndpoint();

sioep.rxSend.subscribe(data => {
    sioep.rxRecv.next(data);
});
