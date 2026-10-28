// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      defaultProps: {
        wrap: true,
      },
      styleOverrides: {
        borderRadius: '0.5rem',
        codeFontFamily: "'JetBrains Mono', monospace",
        codeFontSize: '0.85rem',
        uiFontFamily: "'JetBrains Mono', monospace",
        uiFontSize: '0.75rem',
      },
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
