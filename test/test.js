const CG = require('console-grid');
const { format, LineParser } = require('monocart-formatter/node');

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
        console.log(mapping);
        console.assert(content, item.formattedContent);

    }

};

main();
