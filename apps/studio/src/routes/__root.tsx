import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Sidebar from '../components/Sidebar'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { Layout } from '@hubql/ui/layout'
import { Toaster } from '@hubql/ui/toaster'
import { Checklist } from '../components/Checklist'
const sidebarSearchSchema = z.object({
  q: fallback(z.string().optional(), ``),
})

export const Route = createRootRoute({
  validateSearch: zodValidator(sidebarSearchSchema),
  component: () => (
    <Layout appSwitchMenu={true}>
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
      {import.meta.env.DEV && (
        <TanStackRouterDevtools />
      )}
      <Checklist />
      <Toaster />
    </Layout>
  ),
})
