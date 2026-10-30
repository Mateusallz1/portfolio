// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://gonzatools.com.br',
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
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'pt',
        locales: {
          pt: 'pt-BR',
          en: 'en-US',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
