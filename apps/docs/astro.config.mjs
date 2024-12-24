import { defineConfig } from 'astro/config'
import hubql from '@hubql/astro'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [react(), tailwind(), hubql()],
})
