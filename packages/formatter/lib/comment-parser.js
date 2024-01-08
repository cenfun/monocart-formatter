/* eslint-disable max-classes-per-file */

class QuoteToken {
    constructor(quote) {
        this.quote = quote;
        this.offset = 0;
        this.start = 0;
        this.end = 0;
    }

    getLocation(source) {
        return {
            start: this.start,
            end: this.end,
            text: source.slice(this.start, this.end)
        };
    }

    isOpen(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter === this.quote) {
            // console.log('open', this.quote);
            this.start = i;
            return true;
        }
        return false;
    }

    isClose(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter === '\\') {
            this.offset = 1;
            return false;
        }
        if (currentCharacter === this.quote) {
            // console.log('close', this.quote);
            this.end = i + 1;
            return true;
        }
        return false;
    }
}


class LineCommentToken {
    constructor() {
        this.isComment = true;
        this.offset = 0;
        this.start = 0;
        this.end = 0;
    }

    getLocation(source) {
        return {
            block: false,
            start: this.start,
            end: this.end,
            text: source.slice(this.start, this.end)
        };
    }

    isOpen(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter + nextCharacter === '//') {
            this.start = i;
            this.offset = 1;
            // console.log('open', '//');
            return true;
        }
        return false;
    }

    isClose(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter + nextCharacter === '\r\n') {
            this.end = i;
            this.offset = 1;
            // console.log('close', 'rn');
            return true;
        }
        if (currentCharacter === '\n') {
            this.end = i;
            // console.log('close', 'n');
            return true;
        }
        return false;
    }
}

class BlockCommentToken {
    constructor() {
        this.isComment = true;
        this.offset = 0;
        this.start = 0;
        this.end = 0;
    }

    getLocation(source) {
        return {
            block: true,
            start: this.start,
            end: this.end,
            text: source.slice(this.start, this.end)
        };
    }

    isOpen(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter + nextCharacter === '/*') {
            this.start = i;
            this.offset = 1;
            // console.log('open', '/*');
            return true;
        }
        return false;
    }

    isClose(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter + nextCharacter === '*/') {
            this.end = i + 2;
            this.offset = 1;
            // console.log('close', '*/');
            return true;
        }
        return false;
    }
}

const singleQuote = "'";
const doubleQuote = '"';
const backQuote = '`';
const tokens = [
    new QuoteToken(singleQuote),
    new QuoteToken(doubleQuote),
    new QuoteToken(backQuote),
    new LineCommentToken(),
    new BlockCommentToken()
];

const getToken = (i, currentCharacter, nextCharacter) => {
    for (const item of tokens) {
        if (item.isOpen(i, currentCharacter, nextCharacter)) {
            return item;
        }
    }
};

class CommentParser {

    constructor(source) {

        const len = source.length;
        const comments = [];
        let currentToken;

        for (let i = 0; i < len; i++) {
            const currentCharacter = source[i];
            const nextCharacter = source[i + 1];

            if (currentToken) {
                if (currentToken.isClose(i, currentCharacter, nextCharacter)) {
                    if (currentToken.isComment) {
                        const comment = currentToken.getLocation(source);
                        // console.log(comment.text);
                        comments.push(comment);
                    }
                    //  else {
                    //     console.log(currentToken.getLocation(source).text);
                    // }
                    i += currentToken.offset;
                    currentToken = null;
                } else {
                    i += currentToken.offset;
                }
                continue;
            }

            currentToken = getToken(i, currentCharacter, nextCharacter);
            if (currentToken) {
                i += currentToken.offset;
            }

        }

        if (currentToken) {
            if (currentToken.isComment) {
                currentToken.end = len;
                comments.push(currentToken.getLocation(source));
            }
        }

        this.comments = comments;

    }

    isComment(start, end) {
        if (!this.comments.length) {
            return false;
        }
        const comment = this.findComment(start);
        if (start >= comment.start && end <= comment.end) {
            return true;
        }
        return false;
    }

    findComment(position) {
        const list = this.comments;
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


}

module.exports = CommentParser;
