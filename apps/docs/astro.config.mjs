// @ts-check
import { defineConfig } from 'astro/config'
import hubql from '@hubql/astro'

export default defineConfig({
  integrations: [hubql()],
})
