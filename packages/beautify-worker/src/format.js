import beautify from 'js-beautify';

// eslint-disable-next-line complexity
const getMapping = (oText, fText) => {

    const oList = [0];
    const fList = [0];

    const oLength = oText.length;
    const fLength = fText.length;

    if (!oLength || !fLength) {
        return {
            original: oList,
            formatted: fList
        };
    }

    // high performance
    // str.search(reg) -> index
    // reg.test(str) -> boolean

    const emptyReg = /\s/;

    let record = false;
    let oIndex = 0;
    let fIndex = 0;

    while (oIndex < oLength && fIndex < fLength) {
        const oS = oText[oIndex];
        const fS = fText[fIndex];
        if (oS === fS) {

            if (record && oIndex !== fIndex) {
                // console.log(oIndex, JSON.stringify(oS), fIndex, JSON.stringify(fS));
                oList.push(oIndex);
                fList.push(fIndex);
                record = false;
            }

            oIndex += 1;
            fIndex += 1;
            continue;
        }

        // console.log(oIndex, JSON.stringify(oS), fIndex, JSON.stringify(fS));

        if (emptyReg.test(oS)) {
            oIndex += 1;
        }

        if (emptyReg.test(fS)) {
            fIndex += 1;
        }

        record = true;

    }


    return {
        original: oList,
        formatted: fList
    };
};


const format = (text, type, options = {}) => {

    const types = {
        js: 'js',
        css: 'css',
        html: 'html',
        json: 'js'
    };

    type = types[type] || 'js';

    const formatter = beautify[type] || beautify;

    const formattedText = formatter(text, options);

    const mapping = getMapping(text, formattedText);

    return {
        content: formattedText,
        mapping
    };
};


export default format;
