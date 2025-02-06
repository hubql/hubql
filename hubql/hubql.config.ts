import { defineConfig } from '@hubql/config'

export default defineConfig({
  version: "0.0.1",
  workspaces: [
    {
      id: "hubql-intercom",
      name: "Intercom",
      base: './examples/intercom',
      grid: {
        rules: []
      },
      hubs: [
        {
          name: 'Intercom API',
          type: 'api',
          openapi: './openapi.yml',
        }
      ]
    },
    {
      id: "hubql-petstore",
      name: "Petstore",
      base: './examples/petstore',
      grid: {
        rules: []
      },
      hubs: [
        {
          name: 'Petstore API',
          type: 'api',
          openapi: './openapi.yml',
        }
      ]
    },
    {
      id: 'hubql-workspace',
      name: 'Hubql',
      base: './',
      grid: {
        rules: [
          {
            input: 'docs/llm/**/*.md',
            output: '.cursorrules',
          }
        ]
      },
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
            base: 'docs/content',
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
