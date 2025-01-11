import type { Meta, StoryObj } from '@storybook/react'
import { Method } from '@hubql/ui/method'

const meta = {
  title: 'Method',
  component: Method,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Method>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'GET',
  },
}

export const Post: Story = {
  args: {
    variant: 'post',
    size: 'default',
    children: 'POST',
  },
}

export const Get: Story = {
  args: {
    variant: 'get',
    size: 'default',
    children: 'get',
  },
}

export const Put: Story = {
  args: {
    variant: 'put',
    size: 'default',
    children: 'put',
  },
}
export const Delete: Story = {
  args: {
    variant: 'delete',
    size: 'default',
    children: 'delete',
  },
}

export const Patch: Story = {
  args: {
    variant: 'patch',
    size: 'default',
    children: 'patch',
  },
}

export const Options: Story = {
  args: {
    variant: 'options',
    size: 'default',
    children: 'options',
  },
}
