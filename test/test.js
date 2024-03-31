const http = require('http');
const assert = require('assert');
const EC = require('eight-colors');
const { format, MappingParser } = require('../lib');

const { chromium } = require('playwright');
const Koa = require('koa');
const KSR = require('koa-static-resolver');

const testCases = require('./test-cases.json');

// console.log(format, Mapping);

const emptyReg = /\s/;

const checkOriginalToFormatted = (originalContent, formattedContent, mappingParser) => {
    console.log('- checkOriginalToFormatted');
    for (let i = 0, l = originalContent.length; i < l; i++) {
        const s1 = originalContent[i];
        if (emptyReg.test(s1)) {
            continue;
        }
        const formattedPosition = mappingParser.originalToFormatted(i);
        // out of text, original has more non-null characters
        if (formattedPosition >= formattedContent.length) {
            continue;
        }
        const s2 = formattedContent[formattedPosition];

        // console.log([i, formattedPosition], [s1, s2]);
        assert.equal(s1, s2);
    }
};

const checkFormattedToOriginal = (originalContent, formattedContent, mappingParser) => {
    console.log('- checkFormattedToOriginal');
    for (let i = 0, l = formattedContent.length; i < l; i++) {
        const s1 = formattedContent[i];
        if (emptyReg.test(s1)) {
            continue;
        }
        const originalPosition = mappingParser.formattedToOriginal(i);
        // out of text, original has more non-null characters
        if (originalPosition >= originalContent.length) {
            continue;
        }
        const s2 = originalContent[originalPosition];

        // console.error([i, originalPosition], [s1, s2], originalContent, formattedContent);
        assert.equal(s1, s2);
    }
};

const checkMapping = (originalContent, formattedContent, mappingData) => {

    // console.log(mappingData);

    const mappingParser = new MappingParser(mappingData);
    checkOriginalToFormatted(originalContent, formattedContent, mappingParser);
    checkFormattedToOriginal(originalContent, formattedContent, mappingParser);

};

it('test in node ', async () => {

    for (const item of testCases) {

        console.log('check file', EC.cyan(item.name));
        const { content, mapping } = await format(item.content, item.type);

        // all \r will be removed after formatted
        const formattedContent = item.formattedContent.replace(/\r/g, '');

        assert.equal(content, formattedContent, `formatted content not matched: ${item.name}`);

        checkMapping(item.content, content, mapping);

    }

});

const startServer = () => {
    const serverPort = 8130;
    const serverUrl = `http://localhost:${serverPort}`;

    const app = new Koa();
    app.use(KSR({
        dirs: [
            'packages/formatter/public',
            './'
        ],
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        gzip: false,
        // max-age=<seconds>
        maxAge: 1
    }));

    const server = http.createServer(app.callback());

    return new Promise((resolve) => {

        server.listen(serverPort, function() {
            console.log(`${new Date().toLocaleString()} server listening on ${serverUrl}`);
            resolve({
                server,
                serverUrl
            });
        });

    });
};

it('test in browser', async () => {

    const {
        server,
        serverUrl
    } = await startServer();

    const browser = await chromium.launch({
        // headless: false
    });

    const page = await browser.newPage();

    const errors = [];
    console.log('only show errors');
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    await page.goto(serverUrl);

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    await browser.close();

    server.close();

    EC.logRed(errors);
    assert.equal(errors.length, 1);

});
