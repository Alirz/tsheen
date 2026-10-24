import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'

export function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, login, logout, user } = useAuth()

  return (
    <div className="min-h-screen bg-background-default text-text-default">
      <header className="flex items-center justify-between bg-[#fff8e6] px-8 py-6 text-text-neutral">
        <nav className="flex items-center gap-4">
          <Link to="/" className="type-page-title-24-sb">
            {t('Welcome')}
          </Link>
          <Link to="/app" className="type-body-14-r">
            {t('Menu:App')}
          </Link>
        </nav>
        {isLoading ? null : isAuthenticated ? (
          <Button variant="outline" onClick={() => void logout()}>
            {user?.name ?? t('Logout')}
          </Button>
        ) : (
          <Button onClick={() => void login()}>{t('Login')}</Button>
        )}
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  )
}
