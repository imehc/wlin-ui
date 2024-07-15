import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './index';
import { format } from 'date-fns';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Data/Calendar',
  component: Calendar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'full',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    value: new Date(),
    locale: 'en-US',
  },
};

export const InnerRender: Story = {
  args: {
    value: new Date(),

    dateRender: (value) => (
      <div>
        <p style={{ background: 'yellowgreen', height: '50px' }}>
          {format(value, 'yyyy-MM-dd')}
        </p>
      </div>
    ),

    locale: 'en-US',
  },
};

export const InnerContent: Story = {
  args: {
    value: new Date(),

    dateInnerContent: (value) => (
      <div>
        <p style={{ background: 'yellowgreen', height: '30px' }}>
          {format(value, 'yyyy-MM-dd')}
        </p>
      </div>
    ),

    locale: 'en-US',
  },
};
