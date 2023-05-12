# monocart-formatter

Create [beautify-worker](/packages/beautify-worker) from compressed Data URL.

```js
import { format, Mapping } from 'monocart-formatter';

const text = "var a = 1;";
const type = "js";
const options = {};
const res = await format(text, type, options);

const mapping = new Mapping(res.content, res.mapping);
const location = mapping.getFormattedLocation(41);

```