const http = require('http');

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
        if (s1 !== s2) {
            console.error([i, formattedPosition], [s1, s2]);
        }
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
        if (s1 !== s2) {
            console.error([i, originalPosition], [s1, s2], originalContent, formattedContent);
        }
    }
};

const checkMapping = (originalContent, formattedContent, mappingData) => {

    // console.log(mappingData);

    const mappingParser = new MappingParser(mappingData);
    checkOriginalToFormatted(originalContent, formattedContent, mappingParser);
    checkFormattedToOriginal(originalContent, formattedContent, mappingParser);

};

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

const testBrowser = async () => {

    const {
        server,
        serverUrl
    } = await startServer();

    const browser = await chromium.launch({
        // headless: false
    });

    const page = await browser.newPage();

    console.log('only show errors');
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            EC.logRed(msg.text());
        }
    });

    await page.goto(serverUrl);

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    await browser.close();

    server.close();

};

const test = async () => {

    console.log('==============================================================================');
    EC.logMagenta('test in node ...');
    for (const item of testCases) {

        console.log('check file', EC.cyan(item.name));
        const { content, mapping } = await format(item.content, item.type);

        // all \r will be removed after formatted
        const formattedContent = item.formattedContent.replace(/\r/g, '');
        if (content !== formattedContent) {
            EC.logRed('formatted content not matched', item.name);
        }

        checkMapping(item.content, content, mapping);

    }

    console.log('==============================================================================');
    EC.logMagenta('test in browser ...');

    await testBrowser();

};

test();
