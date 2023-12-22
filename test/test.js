const fs = require('fs');
const path = require('path');
const CG = require('console-grid');
const EC = require('eight-colors');
const {
    format, LineParser, MappingParser
} = require('monocart-formatter/node');

// const LineParser = require('../packages/formatter/src/line-parser.js');

const testCases = require('./test-cases.json');

// console.log(format, Mapping);

const emptyReg = /\s/;

const checkOriginalToFormatted = (originalContent, formattedContent, mappingParser) => {
    console.log('============= checkOriginalToFormatted');
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
    console.log('============= checkFormattedToOriginal');
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

        // all \r will be removed after formatted
        const formattedContent = item.formattedContent.replace(/\r/g, '');
        if (content !== formattedContent) {
            EC.logRed('formatted content not matched', item.name);
        }

        checkMapping(item.content, content, mapping);

    }

    // test comments
    const files = [{
        path: path.resolve('test/cases/', 'comments.js'),
        commentsCount: 15,
        commentLinesCount: 21
    }, {
        path: path.resolve('test/cases/', 'comments.css'),
        commentsCount: 2,
        commentLinesCount: 5
    }, {
        path: path.resolve('packages/formatter/src/generate-mapping.js'),
        commentsCount: 9,
        commentLinesCount: 9
    }, {
        path: path.resolve('test/test-cases.json'),
        commentsCount: 0,
        commentLinesCount: 0
    }, {
        path: path.resolve('package.json'),
        commentsCount: 0,
        commentLinesCount: 0
    }, {
        path: path.resolve('README.md'),
        commentsCount: 0,
        commentLinesCount: 0
    }];

    files.forEach((item) => {
        item.name = path.basename(item.path);

        const source = fs.readFileSync(item.path).toString('utf-8');

        const lineParser = new LineParser(source);

        // add line for comments
        lineParser.comments.forEach((comment) => {
            comment.line = lineParser.findLine(comment.start).line;
        });

        const commentLines = lineParser.lines.filter((l) => l.comment).map((c) => `${EC.yellow(c.line + 1)} ${EC.green(c.text)}`);
        console.log('===========================================', item.name);
        console.log(commentLines.join('\n'));


        if (lineParser.comments.length !== item.commentsCount) {
            EC.logRed('comments count not matched', lineParser.comments.length, item.commentsCount);
        }

        if (commentLines.length !== item.commentLinesCount) {
            EC.logRed('comment lines count not matched', commentLines.length, item.commentLinesCount);
        }

    });


};

main();
