import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Role } from './auth/models'
import { ProfileIncompleteBanner } from './auth/profile-incomplete-banner'
import { ProtectedPage } from './protected/protected-page'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'font-body-md text-body-md text-primary-container border-b-2 border-primary-container pb-1 font-medium'
    : 'font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors'

const RootLayout: React.FC = () => {
  return (
    <div
      className='bg-surface text-on-surface flex min-h-screen flex-col font-body-md text-body-md'
      dir='ltr'
    >
      <nav className='border-surface-variant z-50 mx-auto flex min-h-16 w-full max-w-[1280px] flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-2 shadow-sm sm:px-8 sm:py-0'>
        <div className='font-h3 text-h3 text-on-surface flex items-center gap-2 font-bold'>
          <span
            className='material-symbols-outlined text-primary-container text-[1.5rem]'
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            monetization_on
          </span>
          Witzcoin
        </div>
        <div className='flex flex-wrap items-center gap-x-6 gap-y-2'>
          <ProtectedPage className='contents' reqScope={Role.USER}>
            <NavLink to='/p/transaction' className={navLinkClass}>
              Create Transaction
            </NavLink>
          </ProtectedPage>
          <ProtectedPage className='contents' reqScope={Role.ADMIN}>
            <NavLink to='/p/manage' className={navLinkClass}>
              Manage
            </NavLink>
          </ProtectedPage>
          <ProtectedPage className='contents' reqScope={Role.USER}>
            <NavLink to='/p/profile' className={navLinkClass}>
              Profile
            </NavLink>
          </ProtectedPage>
          <ProtectedPage className='contents' reqScope={Role.USER}>
            <NavLink to='/p/history' className={navLinkClass}>
              History
            </NavLink>
          </ProtectedPage>
          <ProtectedPage className='contents' reqScope={Role.USER}>
            <NavLink to='/p/pending' className={navLinkClass}>
              Pending
            </NavLink>
          </ProtectedPage>
        </div>
        <div className='flex items-center gap-4'>
          <ProtectedPage className='contents' reqScope={Role.USER}>
            <NavLink
              to='/logout'
              className='font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors uppercase'
            >
              Logout
            </NavLink>
          </ProtectedPage>
          <ProtectedPage className='contents flex items-center gap-2' reqScope={Role.OUT}>
            <NavLink
              to='/register'
              className='font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors'
            >
              Register
            </NavLink>
            <NavLink
              to='/login'
              className='font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors'
            >
              Login
            </NavLink>
          </ProtectedPage>
        </div>
      </nav>
      <main className='mx-auto w-full max-w-[1280px] flex-1 px-margin-mobile py-8 md:px-margin-desktop md:py-12'>
        <ProtectedPage reqScope={Role.USER}>
          <ProfileIncompleteBanner />
        </ProtectedPage>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
