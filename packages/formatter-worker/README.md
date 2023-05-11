# monocart-formatter-worker

Extracted from [chrome-devtools-frontend](https://www.npmjs.com/package/chrome-devtools-frontend)

## Getting Started

```js
const format = (type, text) => {
    return new Promise((resolve) => {
        const workerUrl = 'monocart-formatter-worker.js';
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
        worker.onerror = (e) => {
            console.error(e);
            resolve();
            worker.terminate();
        };

    });
};
```
