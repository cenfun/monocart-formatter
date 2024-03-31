# Monocart Formatter
[![](https://img.shields.io/npm/v/monocart-formatter)](https://www.npmjs.com/package/monocart-formatter)
[![](https://badgen.net/npm/dw/monocart-formatter)](https://www.npmjs.com/package/monocart-formatter)
![](https://img.shields.io/github/license/cenfun/monocart-formatter)

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