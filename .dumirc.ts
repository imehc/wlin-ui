import { defineConfig } from 'dumi';
import { resolve } from "path";

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'wlin-ui',
    nav: [
      // { title: 'Introduction', link: '/guide' },
      { title: 'Components', link: '/components/calendar' }, // components会默认自动对应到src文件夹
      // { title: 'Hooks', link: '/hooks' },
    ],
  },
  alias: {
    '#': resolve(__dirname, 'styled-system')
  }
});
