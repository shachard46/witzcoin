import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Role } from './auth/models'
import { ProtectedPage } from './protected/protected-page'
import { Box, Typography } from '@mui/material'
import { Breadcrumb } from 'antd'

const RootLayout: React.FC = () => {
  const [path, setPath] = useState('login')
  const location = useLocation()
  useEffect(() => {
    switch (location.pathname) {
      case '/login':
        setPath('עמוד התחברות')
        break
      case '/p/history':
        setPath('היסטוריית עסקאות')
        break
      case '/register':
        setPath('עמוד הרשמה')
        break
      case '/p/profile':
        setPath('הפרופיל שלך')
        break
      case '/p/pending':
        setPath('עסקאות ממתינות')
        break
      case '/p/transaction':
        setPath('יצירת עסקה')
        break
      case '/p/manage':
        setPath('עמוד מנהל')
        break
    }
  })
  return (
    <div>
      <div className='header-container'>
        <header className='header'>
          <div className='header-logo'>
            <Box
              component='img'
              sx={{
                height: 90,
                width: 90,
              }}
              src='/images/_9f163ebf-f030-493e-b45d-967380f4eb83-ai-brush-removebg-l9vzv47o.png'
            />
            <Box
              component='img'
              sx={{
                height: 40,
                width: 169,
              }}
              src='/images/logoname.png'
            />
          </div>
          <nav>
            <ul className='nav-links'>
              <div className='header-menu'>
                <ProtectedPage className='nav-link' reqScope={Role.USER}>
                  <li>
                    <NavLink to='/p/transaction'>צור עסקה</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage className='nav-link' reqScope={Role.ADMIN}>
                  <li>
                    <NavLink to='/p/manage'>מנהל</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage className='nav-link' reqScope={Role.USER}>
                  <li>
                    <NavLink to='/p/profile'>פרופיל</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage className='nav-link' reqScope={Role.USER}>
                  <li>
                    <NavLink to='/p/history'>הסטוריה</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage className='nav-link' reqScope={Role.USER}>
                  <li>
                    <NavLink to='/p/pending'>ממתינות</NavLink>
                  </li>
                </ProtectedPage>
              </div>
              <div className='header-auth'>
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
              </div>
            </ul>
          </nav>
        </header>
      </div>
      <div className='container'>
        <main className='main'>
          <div className='page-header'>{path}</div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RootLayout
