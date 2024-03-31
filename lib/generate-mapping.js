// eslint-disable-next-line complexity
const generateMapping = (oText, fText) => {

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
    let error;

    while (oIndex < oLength && fIndex < fLength) {
        const oS = oText[oIndex];
        const fS = fText[fIndex];
        if (oS === fS) {

            // console.log([oIndex, fIndex], [oS, fS], 'equal', record);

            if (record) {
                // console.log([oIndex, fIndex], 'record', '--------------------------------');
                oList.push(oIndex);
                fList.push(fIndex);
                record = false;
            }

            oIndex += 1;
            fIndex += 1;
            continue;
        }

        // console.log([oIndex, fIndex], [oS, fS]);

        let spaces = 0;

        if (emptyReg.test(oS)) {
            oIndex += 1;
            spaces += 1;
        }

        if (emptyReg.test(fS)) {
            fIndex += 1;
            spaces += 1;
        }

        if (spaces === 0) {
            // string for JSON
            error = {
                message: `The mapping is terminated, unable to match original "${oS}" at ${oIndex} with formatted "${fS}" at ${fIndex}`
            };
            break;
        }

        record = true;

    }

    const result = {};

    if (error) {
        result.error = error;
    } else if (oIndex < oLength) {
        // original text not end, match to formatted end
        oList.push(oIndex);
        fList.push(fLength);
    }

    result.original = oList;
    result.formatted = fList;

    return result;
};

module.exports = generateMapping;
