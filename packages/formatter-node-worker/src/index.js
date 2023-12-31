import { parentPort } from 'worker_threads';

import format from '../../formatter-worker/src/format.js';

parentPort.on('message', (message) => {
    const {
        text, type, options
    } = message;

    const result = format(text, type, options);

    parentPort.postMessage(result);
});

parentPort.postMessage('workerReady');
