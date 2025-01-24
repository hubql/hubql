import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Sidebar from '../components/Sidebar'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { Layout } from '@hubql/ui/layout'

const sidebarSearchSchema = z.object({
  q: fallback(z.string().optional(), ``),
})

export const Route = createRootRoute({
  validateSearch: zodValidator(sidebarSearchSchema),
  component: () => (
    <Layout appSwitchMenu={true}>
      <Sidebar />
      <div className="flex-1">
        {/* @ts-expect-error Outlet type issue */}
        <Outlet />
      </div>
      {import.meta.env.DEV && (
        // @ts-expect-error Devtools type issue
        <TanStackRouterDevtools />
      )}
    </Layout>
  ),
})
