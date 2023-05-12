// import { FormatterWorker } from 'chrome-devtools-frontend/front_end/entrypoints/formatter_worker/formatter_worker';

import { FormatterWorker } from '../../../../github/devtools-frontend/front_end/entrypoints/formatter_worker/formatter_worker';

onmessage = function(e) {
    const { type, text } = e.data;

    const types = {
        html: 'text/html',
        css: 'text/css',
        js: 'application/javascript',
        json: 'application/json'
    };

    const mimeType = types[type] || type;

    const result = FormatterWorker.format(mimeType, text);

    postMessage(result);

};

postMessage('workerReady');
