const dataStr = require('../../worker/dist/monocart-formatter-worker.lz.js');
const inflateSync = require('lz-utils/inflate-sync');

const generateMapping = require('../node/generate-mapping.js');

const Locator = require('../node/locator.js');
const MappingParser = require('../node/mapping-parser.js');
const LineParser = require('../node/line-parser.js');
const CommentParser = require('../node/comment-parser.js');

const formatterDataUrl = () => {
    const jsStr = inflateSync(dataStr);
    const objectURL = URL.createObjectURL(new Blob([jsStr], {
        type: 'application/javascript'
    }));
    return objectURL;
};

let workerUrl;
const format = (text, type, options) => {

    if (typeof text !== 'string') {
        text = String(text);
    }

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

module.exports = {
    VERSION: window.VERSION,
    TIMESTAMP: window.TIMESTAMP,

    generateMapping,
    format,

    CommentParser,
    LineParser,
    Locator,

    MappingParser
};
