const dataStr = require('../../../.temp/formatter-worker.js');
const inflateSync = require('lz-utils/inflate-sync');
const Mapping = require('./mapping.js');

const formatterDataUrl = () => {
    const jsStr = inflateSync(dataStr);
    const objectURL = URL.createObjectURL(new Blob([jsStr], {
        type: 'application/javascript'
    }));
    return objectURL;
};

let workerUrl;
const formatInWorker = (text, type, options) => {
    if (!workerUrl) {
        workerUrl = new URL(formatterDataUrl());
    }

    return new Promise((resolve) => {

        const worker = new Worker(workerUrl);

        worker.onmessage = (e) => {
            if (e.data === 'workerReady') {
                worker.postMessage({
                    text,
                    type,
                    options
                });
                return;
            }
            resolve(e.data);
            worker.terminate();
        };

        worker.onerror = (err) => {
            resolve({
                error: err
            });
            worker.terminate();
        };

    });
};


const format = async (text, type, options) => {

    if (typeof text !== 'string') {
        text = String(text);
    }

    const res = await formatInWorker(text, type, options);

    return res;
};

module.exports = {
    VERSION: window.VERSION,
    TIMESTAMP: window.TIMESTAMP,
    format,
    Mapping
};
