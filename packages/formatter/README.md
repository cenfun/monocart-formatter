# monocart-formatter

> JS/CSS/HTML/JSON formatter with mapping for both browser and Node.js.

- Using Web Worker in browser

```js
import { format, Mapping } from 'monocart-formatter';

const text = "var a = 1;";
const type = "js";
const options = {};
const res = await format(text, type, options);

const mapping = new Mapping(res.content, res.mapping);
const location = mapping.getFormattedLocation(41);

```
- Using Worker Threads on Node.js

```js
import { format, Mapping } from 'monocart-formatter/node';

```