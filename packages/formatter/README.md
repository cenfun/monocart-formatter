# monocart-formatter

JS/CSS/HTML/JSON formatter for browser using Web Worker.

```js
import { format, Mapping } from 'monocart-formatter';

const text = "var a = 1;";
const type = "js";
const options = {};
const res = await format(text, type, options);

const mapping = new Mapping(res.content, res.mapping);
const location = mapping.getFormattedLocation(41);

```

[formatter-node](/packages/formatter-node) for Nodejs