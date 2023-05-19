import generateMapping from './generate-mapping.js';

const findLine = function(list, position) {
    let start = 0;
    let end = list.length - 1;
    while (end - start > 1) {
        const i = Math.floor((start + end) * 0.5);
        const item = list[i];
        if (position < item.start) {
            end = i;
            continue;
        }
        if (position > item.end) {
            start = i;
            continue;
        }
        return list[i];
    }
    // last two items, less is start
    const endItem = list[end];
    if (position < endItem.start) {
        return list[start];
    }
    return list[end];
};

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


export default class Mapping {

    static generate = generateMapping;

    constructor(formattedContent, mapping) {
        this.formattedContent = formattedContent;
        this.mapping = mapping;

        let pos = 0;
        this.formattedLines = formattedContent.split(/\n/).map((text, line) => {
            const length = text.length;
            const start = pos;
            const end = start + length;

            pos += length + 1;

            return {
                line,
                start,
                end,
                length,
                text
            };
        });

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

    isFormattedLineEmpty(line) {
        const lineInfo = this.getFormattedLine(line);
        if (!lineInfo) {
            return true;
        }
        if (!lineInfo.length) {
            return true;
        }
        const reg = /\S/;
        const hasCode = reg.test(lineInfo.text);
        return !hasCode;
    }

    getFormattedLocation(originalPosition, skipIndent) {

        const formattedPosition = getFormattedPosition(this.mapping, originalPosition);

        const formattedLine = findLine(this.formattedLines, formattedPosition);
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
