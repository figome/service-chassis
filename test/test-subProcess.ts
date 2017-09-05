import SimplePlugin from '../src/simple-plugin';
import { Endpoint } from '../src/endpoint';

const plugin = new SimplePlugin();
const instance = new Endpoint(plugin);

instance.bind(data => {
    instance.send(data, () => {/**/});
});

instance.listen({}, () => {/**/});
