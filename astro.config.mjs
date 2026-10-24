// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import rewriteLocalMarkdownLinks from './src/plugins/rewrite-local-markdown-links.mjs';

const base = '/Resources';

export default defineConfig({
  base, site: 'https://davidots429.github.io',
  markdown: {
    processor: unified({
      remarkPlugins: [[rewriteLocalMarkdownLinks, { base }]],
    }),
  },
  integrations: [
    starlight({
      title: '프로젝트 백과와 자료실',
      disable404Route: true,
      customCss: ['./src/styles/sidebar-toggle.css'],
      components: {
        Header: './src/components/Header.astro',
      },
      locales: {
        root: {
          label: '한국어',
          lang: 'ko',
        },
      },
      sidebar: [
        { label: '소개', slug: 'index' },
        {
          label: 'Foodtech AI Recipe Agent',
          items: [
            { label: '프로젝트 백과', slug: 'foodtech' },
            {
              label: '시작하기',
              collapsed: true,
              items: [
                { slug: 'foodtech/project-overview' },
                { slug: 'foodtech/project-status' },
                { slug: 'foodtech/development-setup' },
                { slug: 'foodtech/glossary' },
              ],
            },
            {
              label: '시스템 설계와 개발',
              collapsed: true,
              items: [
                { label: '시스템 구조', slug: 'foodtech/architecture' },
                { slug: 'foodtech/architecture/modules' },
                { slug: 'foodtech/development-conventions' },
                { slug: 'foodtech/api-reference' },
              ],
            },
            {
              label: '데이터와 수집',
              collapsed: true,
              items: [
                { label: '전체 흐름', slug: 'foodtech/data' },
                { slug: 'foodtech/data/device-data-collection' },
                { slug: 'foodtech/data/mock-device-simulator' },
                { slug: 'foodtech/data/mock-profiles-fixtures' },
                { slug: 'foodtech/data/mock-error-scenarios' },
                { slug: 'foodtech/data/data-standardization' },
                { slug: 'foodtech/data/data-quality' },
                { slug: 'foodtech/data/quality-review-reprocessing' },
                { slug: 'foodtech/data/collection-monitoring' },
                { slug: 'foodtech/data/temporal-derived-views' },
                { slug: 'foodtech/data/data-storage-traceability' },
              ],
            },
            {
              label: '조리와 평가',
              collapsed: true,
              items: [
                { label: '전체 흐름', slug: 'foodtech/cooking' },
                { slug: 'foodtech/cooking/store-profile' },
                { slug: 'foodtech/cooking/equipment-adoption-scenario' },
                { slug: 'foodtech/cooking/cooking-scenarios' },
                { slug: 'foodtech/cooking/cooking-workflow' },
                { slug: 'foodtech/cooking/cooking-state-assessment' },
                { slug: 'foodtech/cooking/recommendation-actual-comparison' },
                { slug: 'foodtech/cooking/cooking-quality-evaluation' },
                { slug: 'foodtech/cooking/performance-analytics' },
                { slug: 'foodtech/cooking/field-validation' },
              ],
            },
            {
              label: 'AI와 레시피',
              collapsed: true,
              items: [
                { label: '전체 흐름', slug: 'foodtech/ai' },
                { slug: 'foodtech/ai/structured-recipe-generation' },
                { slug: 'foodtech/ai/recipe-recommendation' },
                { slug: 'foodtech/ai/recommended-cooking-conditions' },
                { slug: 'foodtech/ai/recipe-qa' },
                { slug: 'foodtech/ai/recipe-lifecycle' },
                { slug: 'foodtech/ai/learning-data-improvement' },
                { slug: 'foodtech/ai/ai-model-credential-usage' },
              ],
            },
            {
              label: '화면과 운영',
              collapsed: true,
              items: [
                { label: '전체 흐름', slug: 'foodtech/operations' },
                { slug: 'foodtech/operations/web-dashboard' },
                { slug: 'foodtech/operations/access-control' },
                { slug: 'foodtech/operations/audit-data-protection' },
                { slug: 'foodtech/operations/privacy-pseudonymization-deletion' },
                { slug: 'foodtech/operations/backup-recovery' },
                { slug: 'foodtech/operations/training-stabilization' },
              ],
            },
            { slug: 'foodtech/troubleshooting' },
            { slug: 'foodtech/meeting-notes' },
            { slug: 'foodtech/artifacts' },
            { slug: 'foodtech/authoring-policy' },
            { label: '프로젝트 자료실', slug: 'foodtech/files' },
            { label: '발표 자료', link: '/foodtech/presentation/' },
          ],
        },
      ],
    }),
  ],
});
