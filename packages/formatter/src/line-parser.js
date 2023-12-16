const isBlank = (codeStr) => {
    const blankBlock = /\S/;
    return !blankBlock.test(codeStr);
};

const isSingleComment = (codeStr) => {
    const singleBlock = /^\s*\/\//g;
    return singleBlock.test(codeStr);
};

// comment start but not start of line
const isCommentStart = (codeStr) => {
    const multiStartBlock = /\/\*/g;
    return multiStartBlock.test(codeStr);
};

const isCommentStartOfLine = (codeStr) => {
    const multiStartBlock = /^\s*\/\*/g;
    return multiStartBlock.test(codeStr);
};

// comment end but not end of line
const isCommentEnd = (codeStr) => {
    const multiEndBlock = /.*\*\//g;
    return multiEndBlock.test(codeStr);
};

const isCommentEndOfLine = (codeStr) => {
    const multiEndBlock = /.*\*\/\s*$/g;
    return multiEndBlock.test(codeStr);
};

class LineParser {
    constructor(content = '', parseLines = true) {
        const lines = this.buildLines(content);
        const blankLines = [];
        const commentLines = [];

        if (parseLines) {
            let commentStart = false;

            const checkCommentEnd = (line, text, i) => {
                if (isCommentEnd(text)) {
                    commentStart = false;
                    if (isCommentEndOfLine(text)) {
                        commentLines.push(i);
                        line.comment = true;
                    }
                    return;
                }
                commentLines.push(i);
                line.comment = true;
            };

            lines.forEach((line, i) => {
                const text = line.text;

                if (commentStart) {
                    return checkCommentEnd(line, text, i);
                }
                if (isCommentStart(text)) {
                    commentStart = true;
                    if (isCommentStartOfLine(text)) {
                        return checkCommentEnd(line, text, i);
                    }
                    return;
                }
                if (isSingleComment(text)) {
                    commentLines.push(i);
                    line.comment = true;
                    return;
                }

                // blank in multiple lines comment, count as comment
                if (isBlank(text)) {
                    blankLines.push(i);
                    line.blank = true;
                }

            });
        }

        this.lines = lines;
        this.blankLines = blankLines;
        this.commentLines = commentLines;
    }

    findLine(position) {
        const list = this.lines;
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
    }

    buildLines(content) {
        let pos = 0;

        // only \n, common on Linux and macOS
        // \r\n, common on Windows
        const lines = content.split(/\n/).map((text, line) => {

            let n = 1;
            // may ends with \r
            const reg = /\r$/;
            if (reg.test(text)) {
                text = text.slice(0, -1);
                n += 1;
            }

            const length = text.length;
            const start = pos;
            const end = start + length;

            pos += length + n;

            return {
                line,
                start,
                end,
                length,
                text
            };
        });

        return lines;
    }

}


module.exports = LineParser;
