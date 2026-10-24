import { posix } from 'node:path';

const projects = ['foodtech', 'speedgraph'];

function visitLinks(node, visitor) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'link') visitor(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visitLinks(child, visitor);
  }
}

function sourcePathToRoute(project, sourcePath) {
  const normalizedPath = posix.normalize(sourcePath);
  if (normalizedPath === 'README.md') return project;
  return `${project}/${normalizedPath.replace(/\.(?:md|mdx)$/, '')}`;
}

function joinBase(base, route) {
  const normalizedBase = `/${String(base ?? '').replace(/^\/+|\/+$/g, '')}`;
  return `${normalizedBase}/${route.replace(/^\/+|\/+$/g, '')}/`;
}

export default function rewriteLocalMarkdownLinks({ base = '' } = {}) {
  return (tree, file) => {
    const sourcePath = String(file.path ?? '').replaceAll('\\', '/');
    if (sourcePath.endsWith('/files/foodtech/README.md')) {
      visitLinks(tree, (node) => {
        const url = String(node.url);
        if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)) return;
        node.url = `${joinBase(base, 'foodtech/files')}${url.replace(/^\.\//, '')}`;
      });
      return;
    }
    const project = projects.find((name) => sourcePath.includes(`/encyclopedia/${name}/`));
    if (!project) return;
    const encyclopediaPathMarker = `/encyclopedia/${project}/`;
    const markerIndex = sourcePath.lastIndexOf(encyclopediaPathMarker);
    if (markerIndex === -1) return;

    const sourceRelativePath = sourcePath.slice(
      markerIndex + encyclopediaPathMarker.length,
    );

    visitLinks(tree, (node) => {
      if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(String(node.url))) return;
      const match = String(node.url).match(/^([^?#]+\.(?:md|mdx))([?#].*)?$/);
      if (!match) return;

      const targetSourcePath = posix.normalize(
        posix.join(posix.dirname(sourceRelativePath), match[1]),
      );
      if (targetSourcePath.startsWith('../')) return;

      const targetRoute = sourcePathToRoute(project, targetSourcePath);
      node.url = `${joinBase(base, targetRoute)}${match[2] ?? ''}`;
    });
  };
}
