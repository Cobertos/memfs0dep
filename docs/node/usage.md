# Usage

> See [demo](https://runkit.com/streamich/memfs-getting-started) on RunKit.

```js
import { fs } from 'memfs';

fs.writeFileSync('/hello.txt', 'World!');
fs.readFileSync('/hello.txt', 'utf8'); // World!
```

Create a file system from a plain JSON:

```js
import { fs, vol } from 'memfs';

const json = {
  './README.md': '1',
  './src/index.js': '2',
  './node_modules/debug/index.js': '3',
};
vol.fromJSON(json, '/app');

fs.readFileSync('/app/README.md', 'utf8'); // 1
vol.readFileSync('/app/src/index.js', 'utf8'); // 2
```

Export to JSON:

```js
vol.writeFileSync('/script.sh', 'sudo rm -rf *');
vol.toJSON(); // {"/script.sh": "sudo rm -rf *"}
```

Use it for testing:

```js
vol.writeFileSync('/foo', 'bar');
expect(vol.toJSON()).toEqual({ '/foo': 'bar' });
```

Construct new `memfs` volumes:

```js
import { memfs } from 'memfs';

const { fs, vol } = memfs({ '/foo': 'bar' });

fs.readFileSync('/foo', 'utf8'); // bar
```

Create as many filesystem volumes as you need:

```js
import { Volume } from 'memfs';

const vol = Volume.fromJSON({ '/foo': 'bar' });
vol.readFileSync('/foo'); // bar

const vol2 = Volume.fromJSON({ '/foo': 'bar 2' });
vol2.readFileSync('/foo'); // bar 2
```
