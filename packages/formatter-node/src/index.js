const {
    Worker, isMainThread, parentPort
} = require('worker_threads');

if (isMainThread) {

    const format = (text, type, options) => {

        if (typeof text !== 'string') {
            text = String(text);
        }

        return new Promise((resolve) => {

            const worker = new Worker(__filename);

            worker.on('message', (message) => {
                if (message === 'workerReady') {
                    worker.postMessage({
                        text,
                        type,
                        options
                    });
                    return;
                }
                resolve(message);
                worker.terminate();
            });

            worker.on('error', (err) => {
                resolve({
                    error: err
                });
                worker.terminate();
            });

        });
    };

    const Mapping = require('../../formatter/src/mapping.js');

    module.exports = {
        format,
        Mapping
    };


} else {

    const formatInWorker = require('../../formatter-worker/src/format.js');

    parentPort.on('message', (message) => {
        const {
            text, type, options
        } = message;

        const result = formatInWorker(text, type, options);

        parentPort.postMessage(result);
    });

    parentPort.postMessage('workerReady');

}

