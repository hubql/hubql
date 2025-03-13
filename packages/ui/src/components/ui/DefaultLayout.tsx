import React, { ReactNode } from 'react'
import Header from './header'
import Footer from './footer'

interface DefaultLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

const DefaultLayout = ({
  children,
  title = 'Hubql Docs',
  description = '',
}: DefaultLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export default DefaultLayout
