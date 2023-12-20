const fs = require('fs');
const path = require('path');
const CG = require('console-grid');
const EC = require('eight-colors');
const { format, LineParser } = require('monocart-formatter/node');

// const LineParser = require('../packages/formatter/src/line-parser.js');

const testCases = require('./test-cases.json');

// console.log(format, Mapping);

const main = async () => {

    testCases.forEach((item) => {
        // const source = item.formattedContent;
        const source = item.content;
        const lineParser = new LineParser(source);

        CG({
            columns: [{
                id: 'indent',
                formatter: (v) => {
                    if (!v) {
                        return '';
                    }
                    return v;
                }
            }, {
                id: 'text',
                name: item.name
            }, {
                id: 'blank',
                formatter: (v) => {
                    if (!v) {
                        return '';
                    }
                    return v;
                }
            }, {
                id: 'length'
            }],
            rows: lineParser.lines
        });

    });

    for (const item of testCases) {
        console.log('===========================================', item.name);
        const { content, mapping } = await format(item.content, item.type);
        console.log(Object.keys(mapping).map((k) => [k, mapping[k].length]));
        console.assert(content, item.formattedContent);
    }

    // test comments
    const files = [{
        name: 'comments.js',
        commentsCount: 15,
        commentLinesCount: 21
    }, {
        name: 'comments.css',
        commentsCount: 2,
        commentLinesCount: 5
    }, {
        name: 'comments.vue',
        commentsCount: 48,
        commentLinesCount: 48
    }];

    files.forEach((item) => {
        const source = fs.readFileSync(path.resolve('test/cases/', item.name)).toString('utf-8');

        const lineParser = new LineParser(source);
        const commentLines = lineParser.lines.filter((l) => l.comment).map((c) => c.text);
        console.log('===========================================', item.name);
        console.log(commentLines);


        if (lineParser.comments.length !== item.commentsCount) {
            EC.logRed('comments count not matched', lineParser.comments.length, item.commentsCount);
        }

        if (commentLines.length !== item.commentLinesCount) {
            EC.logRed('comment lines count not matched', commentLines.length, item.commentLinesCount);
        }

    });

};

main();
