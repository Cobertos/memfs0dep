# Node `fs` API in-memory implementation

In-memory file-system with [Node's `fs` API](https://nodejs.org/api/fs.html).

- Node's `fs` API implemented
- Stores files in memory, in `Buffer`s
- Throws sameish\* errors as Node.js
- Has concept of _i-nodes_
- Implements _hard links_
- Implements _soft links_ (aka symlinks, symbolic links)
- Can be used in browser, see `/demo` folder

## Docs

- [Getting started](./usage.md)
- [Reference](./reference.md)
- [Relative paths](./relative-paths.md)
- [Dependencies](./dependencies.md)

