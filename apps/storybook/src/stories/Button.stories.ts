import type { Meta } from '@storybook/react'

import { Button } from '@hubql/ui/button'

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['button', 'submit', 'reset'],
    },
  },
}

export default meta
