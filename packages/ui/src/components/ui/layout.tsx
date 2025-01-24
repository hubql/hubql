import React, { ReactNode } from 'react'
import { AppSwitchMenu } from './app-switch-menu'
import Footer from './footer'
import Header from './header'

export const Layout = ({
  children,
  appSwitchMenu = false,
}: {
  children: ReactNode
  appSwitchMenu?: boolean
}) => {
  return (
    <div className="flex">
      {appSwitchMenu && <AppSwitchMenu />}
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  )
}
