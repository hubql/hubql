import { defineConfig } from '@hubql/config'

export default defineConfig({
  title: 'Hubql',
  hubs: [
    {
      title: 'Hubql Docs',
      content: {
        dir: './hubql/content',
      },
    },
    {
      title: 'Hubql API Reference',
      openapi: 'https://hubql-elysia-demo.hubql.workers.dev/swagger/json',
      prefix: '/api-reference',
    },
  ],
})
