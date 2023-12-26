import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
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
            <ProtectedPage className='nav-link' level={0}>
              <li>
                <NavLink to='/p/manage'>מנהל</NavLink>
              </li>
            </ProtectedPage>
            <li className='nav-link'>
              <NavLink to='/p/login'>הירשם</NavLink>
            </li>
            <li className='nav-link'>
              <NavLink to='/p/login'>התחבר</NavLink>
            </li>
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
