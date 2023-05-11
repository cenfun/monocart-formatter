const findIndexesOfSubString = (inputString, searchString) => {
    const matches = [];
    let i = inputString.indexOf(searchString);
    while (i !== -1) {
        matches.push(i);
        i = inputString.indexOf(searchString, i + searchString.length);
    }
    return matches;
};

const findLineEndingIndexes = (inputString) => {
    const endings = findIndexesOfSubString(inputString, '\n');
    endings.push(inputString.length);
    return endings;
};

const DEFAULT_COMPARATOR = (a, b) => {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};

const upperBound = (array, needle, comparator) => {
    let l = 0;
    let r = array.length;
    while (l < r) {
        const m = (l + r) >> 1;
        if (comparator(needle, array[m]) >= 0) {
            l = m + 1;
        } else {
            r = m;
        }
    }
    return r;
};


export default class Mapping {

    constructor(formattedContent, mapping) {
        this.formattedContent = formattedContent;
        this.formattedLineEndings = findLineEndingIndexes(formattedContent);
        this.mapping = mapping;
    }

    getFormattedSlice(s, e) {
        return this.formattedContent.slice(s, e);
    }

    getFormattedLine(line) {
        const lineEndings = this.formattedLineEndings;

        const lastLine = lineEndings.length - 1;
        if (line > lastLine) {
            return {
                line,
                start: 0,
                end: 0,
                text: ''
            };
        }

        let sPos = 0;
        if (line) {
            sPos = lineEndings[line - 1] + 1;
        }
        const ePos = lineEndings[line];
        const text = this.getFormattedSlice(sPos, ePos);

        return {
            line,
            start: sPos,
            end: ePos,
            text
        };
    }

    isEmptyLine(line) {
        const info = this.getFormattedLine(line);
        const reg = /\S/;
        const hasCode = reg.test(info.text);
        return !hasCode;
    }

    originalToFormatted(originalPosition) {
        const formattedPosition = this.convertPosition(this.mapping.original, this.mapping.formatted, originalPosition);
        return this.positionToLocation(formattedPosition);
    }

    // =====================================================================================
    // private
    convertPosition(positions1, positions2, position) {
        const index = upperBound(positions1, position, DEFAULT_COMPARATOR) - 1;
        let convertedPosition = positions2[index] + position - positions1[index];
        if (index < positions2.length - 1 && convertedPosition > positions2[index + 1]) {
            convertedPosition = positions2[index + 1];
        }
        return convertedPosition;
    }

    positionToLocation(position) {

        const lineEndings = this.formattedLineEndings;

        // line index (from 0)
        const line = upperBound(lineEndings, position - 1, DEFAULT_COMPARATOR);
        const lastLine = lineEndings.length - 1;

        if (line > lastLine) {
            return {
                line: lastLine,
                column: 0,
                last: 0,
                offset: lineEndings[lastLine]
            };
        }

        const endPos = lineEndings[line];

        let offset;
        let column;
        if (line) {
            offset = lineEndings[line - 1] + 1;
            column = position - offset;
        } else {
            offset = 0;
            column = position;
        }

        const last = endPos - offset;

        return {
            line,
            column,
            last,
            offset
        };
    }
}
