import { defineConfig } from '@hubql/config'

export default defineConfig({
  title: 'Hubql',
  hubs: [
    {
      openapi: 'https://hubql-elysia-demo.hubql.workers.dev/swagger/json',
      content: {
        dir: './hubql/content',
      },
    },
  ],
})
