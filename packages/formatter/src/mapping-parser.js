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


class MappingParser {

    constructor(mapping) {
        this.mapping = mapping;
    }

    originalToFormatted(originalPosition) {
        const { original, formatted } = this.mapping;
        const index = findIndex(original, originalPosition);
        const offset = originalPosition - original[index];
        const formattedPosition = formatted[index] + offset;
        if (index < formatted.length - 1) {
            const nextIndex = formatted[index + 1];
            if (formattedPosition > nextIndex) {
                return nextIndex;
            }
        }
        return formattedPosition;
    }

    formattedToOriginal(formattedPosition) {
        const { original, formatted } = this.mapping;
        const index = findIndex(formatted, formattedPosition);
        const offset = formattedPosition - formatted[index];
        const originalPosition = original[index] + offset;
        if (index < original.length - 1) {
            const nextIndex = original[index + 1];
            if (originalPosition > nextIndex) {
                return nextIndex;
            }
        }
        return originalPosition;
    }

}

module.exports = MappingParser;
