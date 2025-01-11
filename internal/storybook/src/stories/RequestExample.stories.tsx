import { RequestExample } from '@hubql/ui/request-example'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'RequestExample',
  component: RequestExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RequestExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    method: 'GET',
    url: 'https://api.github.com/users/octocat',
    body: null,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token github_pat_11A34D',
    },
  },
}
