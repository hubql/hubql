import { ParamAttribute } from '@hubql/ui/param-attributes'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'ParamAttributes',
  component: ParamAttribute,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ParamAttribute>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    param: {
      name: 'name',
      in: 'query',
      description: 'description',
      required: true,
      schema: {
        type: 'path',
      },
    },
  },
}
