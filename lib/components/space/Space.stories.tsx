import type { Meta, StoryObj } from '@storybook/react';
import { Space } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Layout/Space',
  component: Space,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  // 表现好像不太一致
  args: {
    className: 'w-[300px] h-[300px] bg-green',
    direction: 'horizontal',
    align: 'end',
    wrap: true,
    size: ['large', 'small'], // 可以使用Provider
    children: (
      <>
        <div className="w-[100px] h-[100px] bg-pink border-1 border-solid border-[#000]"></div>
        <div className="w-[100px] h-[100px] bg-pink border-1 border-solid border-[#000]"></div>
        <div className="w-[100px] h-[100px] bg-pink border-1 border-solid border-[#000]"></div>
      </>
    ),
  },
};
