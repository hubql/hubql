import { defineConfig } from '@hubql/config'

export default defineConfig({  
  ide: [
    "Cursor"
  ],
  workspaces: [
    {
      id: 'hubql-workspace',
      name: 'Hubql',
      hubs: [
        {
          name: 'Hubql CLI',
          type: 'cli',
        },
        {
          name: 'Hubql Studio',
          type: 'web',
        },
        {
          name: 'Hubql Sync',
          type: 'api',
        },
        {
          name: 'Hubql Docs',
          type: 'docs',
          content: {
            dir: '../docs/content',
          },
        }      
        // Example API Reference
        // {
        //   title: 'Hubql API Reference',
        //   openapi: 'https://hubql-elysia-demo.hubql.workers.dev/swagger/json',
        //   prefix: '/api-reference',
        // },
      ],
    }
  ]

})
