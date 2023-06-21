# monocart-formatter-node

JS/CSS/HTML/JSON formatter running in the `Node.js` with `Worker Threads`

```js
import { format, Mapping } from 'monocart-formatter-node';

const text = "var a = 1;";
const type = "js";
const options = {};
const res = await format(text, type, options);

const mapping = new Mapping(res.content, res.mapping);
const location = mapping.getFormattedLocation(41);

```
