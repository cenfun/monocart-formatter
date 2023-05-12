
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

    constructor(formattedContent, mapping) {
        this.formattedContent = formattedContent;
        this.mapping = mapping;

        let pos = 0;
        this.formattedLines = formattedContent.split(/\n/).map((text, line) => {
            const length = text.length;
            const start = pos;
            const end = start + text.length;

            pos += length + 1;

            return {
                line,
                start,
                end,
                length,
                text
            };
        });

        // console.log(this.formattedLines);
        // this.formattedLines.forEach((item) => {
        //     const slice = formattedContent.slice(item.start, item.end);
        //     if (slice !== item.text) {
        //         console.error(JSON.stringify(item.text), JSON.stringify(slice));
        //     }
        // });
    }

    getFormattedSlice(s, e) {
        return this.formattedContent.slice(s, e);
    }

    getFormattedLine(line) {
        return this.formattedLines[line];
    }

    isFormattedLineEmpty(line) {
        const info = this.getFormattedLine(line);
        if (!info) {
            return true;
        }
        if (!info.length) {
            return true;
        }
        const reg = /\S/;
        const hasCode = reg.test(info.text);
        return !hasCode;
    }

    getFormattedLocation(originalPosition) {

        const formattedPosition = getFormattedPosition(this.mapping, originalPosition);

        const formattedLine = findLine(this.formattedLines, formattedPosition);
        // console.log(formattedLine);

        const column = formattedPosition - formattedLine.start;

        return {
            column,
            ... formattedLine
        };
    }

}
