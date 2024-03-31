const assert = require('assert');

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

const checkMapping = (originalContent, formattedContent, mappingParser) => {

    checkOriginalToFormatted(originalContent, formattedContent, mappingParser);
    checkFormattedToOriginal(originalContent, formattedContent, mappingParser);

};

module.exports = checkMapping;
