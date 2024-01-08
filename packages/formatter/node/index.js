const { Worker } = require('worker_threads');
const dataStr = require('../dist/monocart-formatter-worker-node.lz.js');
const inflateSync = require('lz-utils/inflate-sync');

const generateMapping = require('./generate-mapping.js');

const Locator = require('./locator.js');
const MappingParser = require('./mapping-parser.js');
const LineParser = require('./line-parser.js');
const CommentParser = require('./comment-parser.js');

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
    generateMapping,
    format,

    CommentParser,
    LineParser,
    Locator,

    MappingParser
};

