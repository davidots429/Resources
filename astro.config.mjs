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
              label: '장비와 데이터 연결',
              items: [
                { slug: 'foodtech/device-data-collection' },
                { slug: 'foodtech/data-standardization' },
                { slug: 'foodtech/data-quality' },
                { slug: 'foodtech/data-storage-traceability' },
                { slug: 'foodtech/mock-device-simulator' },
              ],
            },
            {
              label: '레시피와 AI 지원',
              items: [
                { slug: 'foodtech/structured-recipe-generation' },
                { slug: 'foodtech/recipe-recommendation' },
                { slug: 'foodtech/recommended-cooking-conditions' },
                { slug: 'foodtech/recipe-qa' },
                { slug: 'foodtech/recipe-lifecycle' },
                { slug: 'foodtech/learning-data-improvement' },
              ],
            },
            {
              label: '현장 조리 운영',
              items: [
                { slug: 'foodtech/store-profile' },
                { slug: 'foodtech/equipment-adoption-scenario' },
                { slug: 'foodtech/cooking-workflow' },
                { slug: 'foodtech/recommendation-actual-comparison' },
              ],
            },
            {
              label: '평가와 분석',
              items: [
                { slug: 'foodtech/cooking-quality-evaluation' },
                { slug: 'foodtech/performance-analytics' },
                { slug: 'foodtech/field-validation' },
              ],
            },
            {
              label: '사용자와 운영',
              items: [
                { slug: 'foodtech/web-dashboard' },
                { slug: 'foodtech/access-control' },
                { slug: 'foodtech/collection-monitoring' },
                { slug: 'foodtech/audit-data-protection' },
                { slug: 'foodtech/backup-recovery' },
                { slug: 'foodtech/training-stabilization' },
              ],
            },
            { slug: 'foodtech/authoring-policy' },
            { label: '프로젝트 자료실', slug: 'foodtech/files' },
            { label: '발표 자료', link: '/foodtech/presentation/' },
          ],
        },
      ],
    }),
  ],
});
