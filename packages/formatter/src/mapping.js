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

    constructor(formattedContent, mapping, parseLines) {
        this.formattedContent = formattedContent;
        this.mapping = mapping;
        this.lineParser = new LineParser(formattedContent, parseLines);
        this.formattedLines = this.lineParser.lines;
        this.blankLines = this.lineParser.blankLines;
        this.commentLines = this.lineParser.commentLines;
        this.commentedLines = this.lineParser.commentLines;

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

    getFormattedLocation(originalPosition, skipIndent) {

        const formattedPosition = getFormattedPosition(this.mapping, originalPosition);

        const formattedLine = this.lineParser.findLine(formattedPosition);
        // console.log(formattedLine);

        let indent = 0;
        if (skipIndent) {
            indent = formattedLine.text.search(/\S/);
            if (indent === -1) {
                indent = formattedLine.length;
            }
            // console.log('indent', indent, [formattedLine.text]);
        }

        let column = Math.max(formattedPosition - formattedLine.start, indent);
        column = Math.min(column, formattedLine.length);

        return {
            column,
            indent,
            ... formattedLine
        };
    }

}

module.exports = Mapping;
