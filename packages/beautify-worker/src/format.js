import beautify from 'js-beautify';


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

    const nextPos = (oIndex, fIndex) => {
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
            if (oIndex < oLength && fIndex < fLength) {
                nextPos(oIndex, fIndex);
                return;
            }
            // console.log('index out of length');
            return;
        }

        // console.log(oIndex, JSON.stringify(oS), fIndex, JSON.stringify(fS));

        if (emptyReg.test(oS)) {
            oIndex += 1;
        }

        if (emptyReg.test(fS)) {
            fIndex += 1;
        }

        record = true;

        nextPos(oIndex, fIndex);
    };

    nextPos(0, 0);

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
