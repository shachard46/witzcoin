import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Role } from './auth/models'
import { ProtectedPage } from './protected/protected-page'

const RootLayout: React.FC = () => {
  return (
    <div className='container'>
      <header className='header'>
        <nav>
          <ul className='nav-links'>
            <li className='nav-link'>
              <NavLink to='/p/transaction'>צור עסקה</NavLink>
            </li>
            <ProtectedPage className='nav-link' reqScope={Role.ADMIN}>
              <li>
                <NavLink to='/p/manage'>מנהל</NavLink>
              </li>
            </ProtectedPage>
            <ProtectedPage className='nav-link' reqScope={Role.OUT}>
              <li>
                <NavLink to='/register'>הירשם</NavLink>
              </li>
            </ProtectedPage>
            <ProtectedPage className='nav-link' reqScope={Role.OUT}>
              <li>
                <NavLink to='/login'>התחבר</NavLink>
              </li>
            </ProtectedPage>
            <ProtectedPage className='nav-link' reqScope={Role.USER}>
              <li>
                <NavLink to='/logout'>התנתק</NavLink>
              </li>
            </ProtectedPage>
            <li className='nav-link'>
              <NavLink to='/p/profile'>הפרופיל שלך</NavLink>
            </li>

            <li className='nav-link'>
              <NavLink to='/p/history'>הסטוריית עסקאות</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
