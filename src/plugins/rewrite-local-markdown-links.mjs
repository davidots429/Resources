import { posix } from 'node:path';

const encyclopediaPathMarker = '/encyclopedia/foodtech/';
const filesIndexPath = '/files/foodtech/README.md';

function visitLinks(node, visitor) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'link') visitor(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visitLinks(child, visitor);
  }
}

function sourcePathToRoute(sourcePath) {
  const normalizedPath = posix.normalize(sourcePath);
  if (normalizedPath === 'README.md') return 'foodtech';
  return `foodtech/${normalizedPath.replace(/\.(?:md|mdx)$/, '')}`;
}

function joinBase(base, route) {
  const normalizedBase = `/${String(base ?? '').replace(/^\/+|\/+$/g, '')}`;
  return `${normalizedBase}/${route.replace(/^\/+|\/+$/g, '')}/`;
}

export default function rewriteLocalMarkdownLinks({ base = '' } = {}) {
  return (tree, file) => {
    const sourcePath = String(file.path ?? '').replaceAll('\\', '/');
    const markerIndex = sourcePath.lastIndexOf(encyclopediaPathMarker);
    if (sourcePath.endsWith(filesIndexPath)) {
      visitLinks(tree, (node) => {
        const url = String(node.url);
        if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)) return;
        node.url = `${joinBase(base, 'foodtech/files')}${url.replace(/^\.\//, '')}`;
      });
      return;
    }
    if (markerIndex === -1) return;

    const sourceRelativePath = sourcePath.slice(
      markerIndex + encyclopediaPathMarker.length,
    );

    visitLinks(tree, (node) => {
      const match = String(node.url).match(/^([^?#]+\.(?:md|mdx))([?#].*)?$/);
      if (!match) return;

      const targetSourcePath = posix.normalize(
        posix.join(posix.dirname(sourceRelativePath), match[1]),
      );
      if (targetSourcePath.startsWith('../')) return;

      const targetRoute = sourcePathToRoute(targetSourcePath);
      node.url = `${joinBase(base, targetRoute)}${match[2] ?? ''}`;
    });
  };
}
