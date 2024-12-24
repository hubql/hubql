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
          description: 'A paged array of pets',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Pets',
              },
            },
          },
        },
      },
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        Vary: 'Accept-Encoding',
      },
      body: {
        id: 1,
        name: 'name',
        tag: 'tag',
      },
    },
  },
}
