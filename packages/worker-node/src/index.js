import { parentPort } from 'worker_threads';

import formatSync from '../../formatter/node/format-sync.js';

parentPort.on('message', (message) => {
    const {
        text, type, options
    } = message;

    const result = formatSync(text, type, options);

    parentPort.postMessage(result);
});

parentPort.postMessage('workerReady');
