export type FormatterMapping = {
    original: number[],
    formatted: number[]
}

export function generateMapping(
    originalText: string,
    formattedText: string
): FormatterMapping

/**
 * @text source content
 * @type js/css/html/json
 * @options https://github.com/beautify-web/js-beautify
*/
export function format(
    text: string,
    type?: string,
    options?: any
): Promise<{
    content: string,
    mapping: FormatterMapping,
    error?: Error
}>

export class MappingParser {
    constructor(mapping: FormatterMapping);
    originalToFormatted(originalPosition: number): number
    formattedToOriginal(formattedPosition: number): number
}