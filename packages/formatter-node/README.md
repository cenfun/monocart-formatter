# monocart-formatter-node

JS/CSS/HTML/JSON formatter for Node.js using Worker Threads.

```js
import { format, Mapping } from 'monocart-formatter-node';

const text = "var a = 1;";
const type = "js";
const options = {};
const res = await format(text, type, options);

const mapping = new Mapping(res.content, res.mapping);
const location = mapping.getFormattedLocation(41);

```

[formatter](/packages/formatter) for browser