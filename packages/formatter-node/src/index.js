const { Worker } = require('worker_threads');
const dataStr = require('../../../.temp/formatter-node-worker.js');
const inflateSync = require('lz-utils/inflate-sync');

const generateMapping = require('../../formatter/src/generate-mapping.js');

const Locator = require('../../formatter/src/locator.js');
const MappingParser = require('../../formatter/src/mapping-parser.js');
const LineParser = require('../../formatter/src/line-parser.js');
const CommentParser = require('../../formatter/src/comment-parser.js');

const formatterDataUrl = () => {
    const jsStr = inflateSync(dataStr);
    const b64 = Buffer.from(jsStr).toString('base64');
    // console.log(jsStr);
    const objectURL = `data:text/javascript;base64,${b64}`;
    // console.log(objectURL);
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

