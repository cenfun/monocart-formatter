

export type FormatterMapping = {
    original: number[],
    formatted: number[]
}

/**
 * @text source content
 * @type js/css/html/json
 * @options https://github.com/beautify-web/js-beautify
 *  */
export function format(
    text: string,
    type?: string,
    options?: any
): Promise<{ content: string, mapping: FormatterMapping } | { error: Error }>

export default format