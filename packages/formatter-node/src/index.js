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

    const generateMapping = require('../../formatter/src/generate-mapping.js');

    const Locator = require('../../formatter/src/locator.js');
    const MappingParser = require('../../formatter/src/mapping-parser.js');
    const LineParser = require('../../formatter/src/line-parser.js');
    const CommentParser = require('../../formatter/src/comment-parser.js');

    module.exports = {
        VERSION: window.VERSION,
        TIMESTAMP: window.TIMESTAMP,

        format,
        generateMapping,

        Locator,
        MappingParser,
        LineParser,
        CommentParser
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

