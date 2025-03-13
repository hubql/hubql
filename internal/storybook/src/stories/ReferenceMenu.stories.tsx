import { ReferenceMenu } from '@hubql/ui/reference-menu'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'ReferenceMenu',
  component: ReferenceMenu,
  parameters: {
    layout: 'full',
  },
} satisfies Meta<typeof ReferenceMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentAPI: {
      openapi: '3.0.0',
      info: {
        title: 'title',
        version: 'version',
      },
      paths: {
        '/path': {
          get: {
            summary: 'summary',
            operationId: 'operationId',
            tags: ['tag'],
            responses: {
              '200': {
                description: 'description',
              },
            },
          },
        },
      },
    },
  },
}
