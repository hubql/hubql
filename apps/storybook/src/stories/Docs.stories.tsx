import { Docs } from '@hubql/ui/docs'
import type { Meta, StoryObj } from '@storybook/react'

const mock = {
  frontmatter: {
    title: 'Overview',
    seoTitle: 'Introduction',
    seoDescription:
      'Welcome to Hubql Docs! this is where you will find official information on how to use Hubql  API client in your projects.',
    order: 0,
    heroImage: '',
    category: 'categories/introduction.md',
    outline: true,
  },
  content: `
  Welcome to Hubql Docs! this is where you will find official information on how to use the Hubql API client in your projects.
  
  ### What is Hubql?
  
  Hubql is a local-first API client working closely with server plugins like NestJS and ElysiaJS. You can run Hubql client directly in VS code or try our cloud platform. What can you do with Hubql?
  
  ### Send Request
  
  You can send requests in Hubql to connect your APIs.
  
  ### Use workspace
  
  Hubql workspaces are perfect for companies where team members can share their API projects.
  
  ### Use Hubs
  
  Hubql Hubs are a great way to allow you to work on different projects with different secrets and tokens.
  
  ### Use Environment
  
  Environments allow you to switch between different configurations or users for your API requests to test against different environments.
  
  ### Get Started
  
  Now that you know a bit more about us, are you ready to get started?
  
  [Start now](/docs/quickstarts/get-started)
    `,
}

const meta = {
  title: 'Docs/Home',
  component: Docs,
  parameters: {
    layout: 'full',
  },
} satisfies Meta<typeof Docs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    menu: [
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
    ],
    content: mock,
  },
}
