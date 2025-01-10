import { default as sharedConfig } from '@hubql/ui/tailwind.config'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  ...sharedConfig,
}
