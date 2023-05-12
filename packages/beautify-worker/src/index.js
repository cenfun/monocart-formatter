import format from './format.js';

onmessage = function(e) {
    const {
        text, type, options
    } = e.data;

    const result = format(text, type, options);

    postMessage(result);

};

postMessage('workerReady');
