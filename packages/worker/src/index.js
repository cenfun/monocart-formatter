const formatSync = require('../../formatter/node/format-sync.js');

onmessage = function(e) {
    const {
        text, type, options
    } = e.data;

    const result = formatSync(text, type, options);

    postMessage(result);

};

postMessage('workerReady');
