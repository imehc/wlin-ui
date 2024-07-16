import type { Meta, StoryObj } from '@storybook/react';
import { createFromIconfont, Icon } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Common/Icon',
  component: Icon,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

const addPath = (
  <path d="M853.333333 480H544V170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v309.333333H170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h309.333333V853.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V544H853.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"></path>
);

const emailPath = (
  <path d="M874.666667 181.333333H149.333333c-40.533333 0-74.666667 34.133333-74.666666 74.666667v512c0 40.533333 34.133333 74.666667 74.666666 74.666667h725.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V256c0-40.533333-34.133333-74.666667-74.666666-74.666667z m-725.333334 64h725.333334c6.4 0 10.666667 4.266667 10.666666 10.666667v25.6L512 516.266667l-373.333333-234.666667V256c0-6.4 4.266667-10.666667 10.666666-10.666667z m725.333334 533.333334H149.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V356.266667l356.266666 224c4.266667 4.266667 10.666667 4.266667 17.066667 4.266666s12.8-2.133333 17.066667-4.266666l356.266666-224V768c0 6.4-4.266667 10.666667-10.666666 10.666667z"></path>
);

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Size: Story = {
  args: {
    children: addPath,
    size: '40px',
  },
};

export const Spin: Story = {
  args: {
    children: emailPath,
    spin: true,
  },
};

export const Style: Story = {
  args: {
    // 使用createIcon方法
    children: emailPath,
    style: { color: 'blue', fontSize: '50px' },
  },
};

export const Iconfont: Story = {
  loaders: [
    () => {
      // 直接使用createFromIconfont方法
      const scriptUrl = '//at.alicdn.com/t/c/font_4443338_a2wwqhorbk4.js';
      const loadedSet = new Set<string>();
      if (!loadedSet.has(scriptUrl)) {
        const script = document.createElement('script');
        script.setAttribute('src', scriptUrl);
        script.setAttribute('data-namespace', scriptUrl);
        document.body.appendChild(script);

        loadedSet.add(scriptUrl);
      }
    },
  ],
  args: {
    // fill: 'blue',
    size: '40px',
    children: (
      <use
        // xlinkHref="#icon-shouye-zhihui"
        xlinkHref="#icon-gerenzhongxin-zhihui"
      />
    ),
  },
};
