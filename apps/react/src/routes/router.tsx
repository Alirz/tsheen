import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { authGuard } from '@/lib/auth/AuthContext'
import { AppHomePage, HomePage } from '@/features/home'

const rootRoute = createRootRoute({
  component: function RootLayout() {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    )
  },
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  beforeLoad: authGuard,
  component: AppHomePage,
})

const routeTree = rootRoute.addChildren([indexRoute, appRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
