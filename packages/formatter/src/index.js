import dataStr from '../../../.temp/formatter-worker.js';
import inflateSync from 'lz-utils/inflate-sync';
import Mapping from './mapping.js';

const formatterDataUrl = () => {
    const jsStr = inflateSync(dataStr);
    const objectURL = URL.createObjectURL(new Blob([jsStr], {
        type: 'application/javascript'
    }));
    return objectURL;
};

let workerUrl;
const formatInWorker = (text, type) => {
    if (!workerUrl) {
        workerUrl = new URL(formatterDataUrl());
    }

    return new Promise((resolve) => {

        const worker = new Worker(workerUrl);

        worker.onmessage = (e) => {
            if (e.data === 'workerReady') {
                worker.postMessage({
                    type,
                    text
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


const format = async (text, type = 'js') => {

    if (typeof text !== 'string') {
        return {
            error: new Error('The text must be a string')
        };
    }

    const res = await formatInWorker(text, type);

    return res;
};


export default format;

export { format, Mapping };
