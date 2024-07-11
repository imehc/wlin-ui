import {
  defineConfig,
  presetAttributify,
  presetUno,
  presetIcons,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      cdn: 'https://esm.sh/',
      collections: {},
    }),
  ],
  shortcuts: [],
  rules: [],
  theme: {
    colors: {},
  },
});
