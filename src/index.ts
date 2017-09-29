import StdInOutEndpoint from './std-in-out-endpoint';
import MemoryEndpoint from './memory-endpoint';
import FirstLastEndpoint from './first-last-endpoint';
import ExecFileEndpoint from './execFile-endpoint';

export default {
    StdIO: StdInOutEndpoint,
    Memory: MemoryEndpoint,
    MessageParser: FirstLastEndpoint,
    ExecFile: ExecFileEndpoint
};
