import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://fackt.io',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
});
