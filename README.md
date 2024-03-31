# Monocart Formatter

> JS/CSS/HTML/JSON formatter

## Features
- Base on [js-beautify](https://github.com/beautifier/js-beautify)
- Generating mapping after formatted
- Working with web worker in browser
- Working with worker threads in Node.js
- Minifying worker code with gzip

## Install
```sh
npm i monocart-formatter
```

## Usage
```js
import { format, MappingParser } from 'monocart-formatter';

const text = "var a = 1;";
const type = "js";
// js-beautify options https://github.com/beautify-web/js-beautify
const options = {}; 
const { content, mapping } = await format(text, type, options);

console.log("formatted content", content);

const mappingParser = new MappingParser(mapping);
// originalPosition = 10
const formattedPosition = mappingParser.originalToFormatted(10);
const originalPosition = mappingParser.formattedToOriginal(formattedPosition);

```

## API
```js
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
```