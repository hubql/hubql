import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-border py-1.5 px-2">
      <p className="text-xs text-right">
        <a href="https://www.hubql.com/ref=astro" className="hover:underline underline-offset-2">
          Powered by <span className="text-accent">Hubql</span>
        </a>
      </p>
    </footer>
  )
}

export default Footer
