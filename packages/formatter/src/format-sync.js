const beautify = require('js-beautify');
const generateMapping = require('./generate-mapping.js');

const formatSync = (text, type, options = {}) => {

    const types = {
        js: 'js',
        css: 'css',
        html: 'html',
        json: 'js'
    };

    type = types[type] || 'js';

    const formatter = beautify[type] || beautify;

    // https://github.com/beautify-web/js-beautify
    options = {
        'indent_size': 4,
        'indent_char': ' ',
        'indent_with_tabs': false,
        'indent_level': 0,

        'eol': '\n',
        'end_with_newline': false,

        ... options
    };

    const formattedText = formatter(text, options);

    // all \r will be removed after formatted
    const mapping = generateMapping(text, formattedText);

    return {
        content: formattedText,
        mapping
    };
};

module.exports = formatSync;
