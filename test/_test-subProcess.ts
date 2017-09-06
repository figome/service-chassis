import SimplePlugin from '../src/plugins/simple-plugin';
import ServiceChassis from '../src/endpoint';

const plugin = new SimplePlugin();
const instance = new ServiceChassis(plugin);

instance.read(data => {
    instance.write(data, () => {/**/});
});

instance.listen({}, () => {/**/});
