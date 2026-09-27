import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

function generateRouteId({ entry }: { entry: string }) {
  if (entry === 'src/content/docs/index.md') return 'index';
  if (entry === 'encyclopedia/foodtech/README.md') return 'foodtech';
  if (entry === 'files/foodtech/README.md') return 'foodtech/files';

  const restgcnPrefix = 'files/restgcn/';
  if (entry.startsWith(restgcnPrefix)) {
    const relativePath = entry
      .slice(restgcnPrefix.length)
      .replace(/\.(?:md|mdx)$/, '')
      .replaceAll('_', '-')
      .toLowerCase();
    return `restgcn/${relativePath}`;
  }

  const encyclopediaPrefix = 'encyclopedia/foodtech/';
  if (entry.startsWith(encyclopediaPrefix)) {
    const relativePath = entry
      .slice(encyclopediaPrefix.length)
      .replace(/\.(?:md|mdx)$/, '');
    return `foodtech/${relativePath}`;
  }

  throw new Error(`지원하지 않는 문서 경로입니다: ${entry}`);
}

export const collections = {
  docs: defineCollection({
    loader: glob({
      base: '.',
      pattern: [
        'src/content/docs/index.md',
        'encyclopedia/foodtech/**/*.{md,mdx}',
        'files/foodtech/README.md',
        'files/restgcn/**/*.{md,mdx}',
      ],
      generateId: generateRouteId,
    }),
    schema: docsSchema(),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
