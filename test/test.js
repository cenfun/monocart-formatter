const assert = require('assert');
const EC = require('eight-colors');
const { format, MappingParser } = require('../lib');

const testCases = require('../packages/formatter/test/data/test-cases.json');
const checkMapping = require('../packages/formatter/test/data/check-mapping.js');

// console.log(format, Mapping);


it('test in node', async () => {

    for (const item of testCases) {

        console.log('check file', EC.cyan(item.name));
        const { content, mapping } = await format(item.content, item.type);

        // all \r will be removed after formatted
        const formattedContent = item.formattedContent.replace(/\r/g, '');

        assert.equal(content, formattedContent, `formatted content not matched: ${item.name}`);

        const mappingParser = new MappingParser(mapping);

        checkMapping(item.content, content, mappingParser);

    }

});
