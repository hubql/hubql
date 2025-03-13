import { ParamAccordion } from '@hubql/ui/param-accordion'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'ParamAccordion',
  component: ParamAccordion,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ParamAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    params: [
      {
        name: 'name',
        in: 'query',
        description: 'description',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        name: 'name',
        in: 'query',
        description: 'description',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        name: 'name',
        in: 'query',
        description: 'description',
        required: false,
        schema: {
          type: 'string',
        },
      },
    ],
  },
}
