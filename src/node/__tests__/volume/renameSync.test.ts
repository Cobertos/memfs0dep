import { create, tryGetChildNode } from '../../../__tests__/util';

describe('renameSync(fromPath, toPath)', () => {
  it('Renames a file', () => {
    const vol = create({ '/foo': 'bar' });
    expect(tryGetChildNode(vol._core.root, 'foo').isFile()).toBe(true);
    vol.renameSync('/foo', '/baz');
    expect(vol._core.root.getChild('foo')).toBeUndefined();
    expect(tryGetChildNode(vol._core.root, 'baz').isFile()).toBe(true);
    expect(vol.readFileSync('/baz', 'utf8')).toBe('bar');
  });

  it('Updates deep links properly when renaming a directory', () => {
    const vol = create({});
    vol.mkdirSync('/foo/bar/qux', { recursive: true });
    vol.writeFileSync('/foo/bar/qux/a.txt', 'hello');
    vol.renameSync('/foo/', '/faa/');

    expect(vol.toJSON()).toEqual({
      '/faa/bar/qux/a.txt': 'hello',
    });

    vol.renameSync('/faa/bar/qux/a.txt', '/faa/bar/qux/b.txt');
    expect(vol.toJSON()).toEqual({
      '/faa/bar/qux/b.txt': 'hello',
    });

    vol.renameSync('/faa/', '/fuu/');
    expect(vol.toJSON()).toEqual({
      '/fuu/bar/qux/b.txt': 'hello',
    });

    vol.renameSync('/fuu/bar/', '/fuu/bur/');
    expect(vol.toJSON()).toEqual({
      '/fuu/bur/qux/b.txt': 'hello',
    });
  });
  it('Rename file two levels deep', () => {
    const vol = create({ '/1/2': 'foobar' });
    vol.renameSync('/1/2', '/1/3');
    expect(vol.toJSON()).toEqual({ '/1/3': 'foobar' });
  });
  it('Rename file three levels deep', () => {
    const vol = create({
      '/foo1': 'bar',
      '/foo2/foo': 'bar',
      '/foo3/foo/foo': 'bar',
    });
    vol.renameSync('/foo3/foo/foo', '/foo3/foo/foo2');
    expect(vol.toJSON()).toEqual({
      '/foo1': 'bar',
      '/foo2/foo': 'bar',
      '/foo3/foo/foo2': 'bar',
    });
  });
  it('Throws on no params', () => {
    const vol = create();
    expect(() => {
      (vol as any).renameSync();
    }).toThrowErrorMatchingSnapshot();
  });
  it('Throws on only one param', () => {
    const vol = create({ '/foo': 'bar' });
    expect(() => {
      (vol as any).renameSync('/foo');
    }).toThrowErrorMatchingSnapshot();
  });
  it('Throws if path is of wrong type', () => {
    const vol = create({ '/foo': 'bar' });
    expect(() => {
      (vol as any).renameSync('/foo', 123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('throws EACCES when source directory has insufficient permissions', () => {
    const perms = [
      0o666, // rw
      0o555, // rx - insufficient because the file will be removed from this directory during renaming
    ];
    perms.forEach(perm => {
      const vol = create({ '/src/test': 'test' });
      vol.mkdirSync('/dest');
      vol.chmodSync('/src', perm);
      expect(() => {
        vol.renameSync('/src/test', '/dest/fail');
      }).toThrow(/EACCES/);
    });
  });

  it('throws EACCES when destination directory has insufficient permissions', () => {
    const perms = [
      0o666, // rw
      0o555, // rx
    ];
    perms.forEach(perm => {
      const vol = create({ '/src/test': 'test' });
      vol.mkdirSync('/dest', { mode: perm });
      expect(() => {
        vol.renameSync('/src/test', '/dest/fail');
      }).toThrow(/EACCES/);
    });
  });

  it('throws EACCES when intermediate directory has insufficient permissions', () => {
    const vol = create({ '/src/test': 'test' });
    vol.mkdirSync('/dest');
    vol.chmodSync('/', 0o666); // rw
    expect(() => {
      vol.renameSync('/src/test', '/dest/fail');
    }).toThrow(/EACCES/);
  });
});
