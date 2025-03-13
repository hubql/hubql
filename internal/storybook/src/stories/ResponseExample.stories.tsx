import { ResponseExample } from '@hubql/ui/response-example'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'ResponseExample',
  component: ResponseExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ResponseExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    methodInfo: {
      responses: {
        '200': {
          description: 'string',
          content: {
            'application/json': {
              schema: {
                $ref: 'string'
              }
            }
          }
        }
      }
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'string',
        Vary: 'string'
      },
      body: {}
    },
    currentAPI: {
      openapi: '3.0.0',
      info: {
        title: 'Example API',
        version: '1.0.0'
      },
      paths: {}
    }
  },
}
