import { ReferenceLayout } from '@hubql/ui/reference-layout'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'ReferenceLayout',
  component: ReferenceLayout,
  parameters: {
    layout: 'full',
  },
} satisfies Meta<typeof ReferenceLayout>

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
          },
        },
      },
    },
    children: null,
  },
}
