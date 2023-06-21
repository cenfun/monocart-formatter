# monocart-formatter

JS/CSS/HTML/JSON formatter for both browser and Node.js.

- browser using Web Worker

```js
import { format, Mapping } from 'monocart-formatter';

const text = "var a = 1;";
const type = "js";
const options = {};
const res = await format(text, type, options);

const mapping = new Mapping(res.content, res.mapping);
const location = mapping.getFormattedLocation(41);

```
- Node.js using Worker Threads

```js
import { format, Mapping } from 'monocart-formatter/node';

```