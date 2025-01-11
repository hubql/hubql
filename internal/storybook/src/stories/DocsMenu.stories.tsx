import { DocsMenu } from '@hubql/ui/docs-menu'
import type { Meta, StoryObj } from '@storybook/react'

const menu = [
  {
    category: 'Introduction',
    categoryUrl: 'introduction',
    items: [{ title: 'Overview', filename: 'overview' }],
  },
  {
    category: 'Getting Started',
    categoryUrl: 'quickstarts',
    items: [
      { title: 'Get started', filename: 'get-started' },
      { title: 'NestJS', filename: 'nestjs' },
      { title: 'Elysia', filename: 'elysia' },
      { title: 'Fastify', filename: 'fastify' },
      { title: 'Hono', filename: 'hono' },
      { title: 'CDN', filename: 'cdn' },
    ],
  },
  {
    category: 'Request',
    categoryUrl: 'request',
    items: [{ title: 'Overview', filename: 'overview' }],
  },
  {
    category: 'Response',
    categoryUrl: 'response',
    items: [{ title: 'Overview', filename: 'overview' }],
  },
]

const meta = {
  title: 'Docs/DocsMenu',
  component: DocsMenu,
  parameters: {
    layout: 'full',
  },
} satisfies Meta<typeof DocsMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    menu,
  },
}
