import { HubqlLogo } from './hubql-logo'
import { ArrowUpDown, BookMarked, Grid, Network } from 'lucide-react'

export const AppSwitchMenu = () => {
  const linkStyle =
    'w-full group flex items-center justify-center hover:bg-muted rounded-lg p-2 stroke-2'
  const iconStyle = 'w-6 h-6 group-hover:text-accent stroke-1'
  return (
    <div id="app-switch-menu" className="w-12 h-screen border-r border-border">
      <div className="flex flex-col items-center justify-start h-full gap-2">
        <HubqlLogo variant="icon" className="w-10 h-10 mt-2" />
        <a href="/" className={linkStyle}>
          <Grid className={iconStyle} />
        </a>
        <a href="/" className={linkStyle}>
          <ArrowUpDown className={iconStyle} />
        </a>
        <a href="/" className={linkStyle}>
          <BookMarked className={iconStyle} />
        </a>
        <a href="/" className={linkStyle}>
          <Network className={iconStyle} />
        </a>
      </div>
    </div>
  )
}
