# monocart-formatter

Create [formatter-worker](/packages/formatter-worker) from compressed Data URL.

```js
import { format, Mapping } from 'monocart-formatter';

const text = "var a = 1;";
const type = "js";
const res = await format(text, type);

const mapping = new Mapping(res.content, res.mapping);
const location = mapping.originalToFormatted(41);

```