import type { Preview } from "@storybook/react";
import 'virtual:uno.css';
import '@unocss/reset/normalize.css';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
