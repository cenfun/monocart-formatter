const generateMapping = require('./generate-mapping.js');
const LineParser = require('./line-parser.js');

const findIndex = function(list, position) {
    let start = 0;
    let end = list.length - 1;
    while (end - start > 1) {
        const i = Math.floor((start + end) * 0.5);
        const item = list[i];
        if (position < item) {
            end = i;
            continue;
        }
        if (position > item) {
            start = i;
            continue;
        }
        // equal item
        return i;
    }
    // last two items, less is start
    const endItem = list[end];
    if (position < endItem) {
        return start;
    }
    return end;
};

const getFormattedPosition = function(mapping, originalPosition) {
    const { original, formatted } = mapping;
    const index = findIndex(original, originalPosition);
    const offset = originalPosition - original[index];
    const newIndex = formatted[index] + offset;
    if (index < formatted.length - 1) {
        const nextIndex = formatted[index + 1];
        if (newIndex > nextIndex) {
            return nextIndex;
        }
    }
    return newIndex;
};

// =======================================================================================
class Mapping {

    static generate = generateMapping;

    constructor(formattedContent, mapping) {
        this.formattedContent = formattedContent;
        this.mapping = mapping;
        this.lineParser = new LineParser(formattedContent);
        this.formattedLines = this.lineParser.lines;
    }

    getFormattedSlice(s, e) {
        return this.formattedContent.slice(s, e);
    }

    getFormattedLine(line) {
        const lineInfo = this.formattedLines[line];
        if (lineInfo) {
            return {
                ... lineInfo
            };
        }
    }

    // add column
    getFormattedLocation(originalPosition, skipIndent) {

        const formattedPosition = getFormattedPosition(this.mapping, originalPosition);

        // always have lines and find line
        const formattedLine = this.lineParser.findLine(formattedPosition);
        // console.log(formattedLine);

        const {
            start, indent, length
        } = formattedLine;

        let min = 0;
        if (skipIndent) {
            min = indent;
        }

        let column = Math.max(formattedPosition - start, min);
        column = Math.min(column, length);

        return {
            column,
            ... formattedLine
        };
    }

}

module.exports = Mapping;
