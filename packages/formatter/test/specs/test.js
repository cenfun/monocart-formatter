const assert = require('assert');

const {
    format, MappingParser, generateMapping
} = require('../../src');

const testCases = require('../data/test-cases.json');
const checkMapping = require('../data/check-mapping.js');

it('test in browser', async () => {

    for (const item of testCases) {

        console.log('check file', item.name);
        const { content, mapping } = await format(item.content, item.type);

        // all \r will be removed after formatted
        const formattedContent = item.formattedContent.replace(/\r/g, '');

        assert.equal(content, formattedContent, `formatted content not matched: ${item.name}`);
        const mappingParser = new MappingParser(mapping);

        checkMapping(item.content, content, mappingParser);

    }

});

it('test mapping', () => {
    const list = [
        ['aaa', 'aaa'],
        ['a   a\n  a', 'a\na\na'],
        ['a a  a', 'a\r\na\r\n\r\na'],
        ['var  a=1;\r\nvar b;', 'var a = 1;\nvar b;'],
        ['console.log(1);var   a= true;', 'console.log(1);\r\nvar a = true;'],
        ['aaa\n\tbbb\t ccc', 'aaa\n    bbb\n    \nccc'],
        ['aaa', 'a a a '],
        ['aaa ', 'a a a'],
        ['aaab', 'a a a'],
        ['aaa', 'a a ab'],
        // error case
        ['  error case', '   a a a']
    ];

    list.forEach((arr) => {
        const mapping = generateMapping(arr[0], arr[1]);
        console.log(arr, mapping);
        if (mapping.error) {
            console.log('it should be a mapping error here');
            console.error(arr, mapping.error);
        } else {
            const mappingParser = new MappingParser(mapping);
            checkMapping(arr[0], arr[1], mappingParser);
        }
    });
});
