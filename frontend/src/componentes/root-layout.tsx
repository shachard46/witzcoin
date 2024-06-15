import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Role } from './auth/models'
import { ProtectedPage } from './protected/protected-page'
import { Box } from '@mui/material'

const RootLayout: React.FC = () => {
  return (
    <div>
      <header className='header'>
        <Box
          component='img'
          sx={{
            height: 90,
            width: 90,
          }}
          style={{marginLeft: '30px'}}
          src='/images/_9f163ebf-f030-493e-b45d-967380f4eb83-ai-brush-removebg-l9vzv47o.png'
        />
        <nav>
          <ul className='nav-links'>
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
            <ProtectedPage className='nav-link' reqScope={Role.USER}>
              <li>
                <NavLink to='/p/profile'>הפרופיל שלך</NavLink>
              </li>
            </ProtectedPage>
            <ProtectedPage className='nav-link' reqScope={Role.USER}>
              <li>
                <NavLink to='/p/history'>הסטוריית עסקאות</NavLink>
              </li>
            </ProtectedPage>
            <ProtectedPage className='nav-link' reqScope={Role.USER}>
              <li>
                <NavLink to='/p/pending'>עסקאות ממתינות</NavLink>
              </li>
            </ProtectedPage>
          </ul>
        </nav>
        <Box
          component='img'
          sx={{
            height: 90,
            width: 90,
          }}
          style={{marginRight: '30px'}}
          src='/images/_9f163ebf-f030-493e-b45d-967380f4eb83-ai-brush-removebg-l9vzv47o.png'
        />
      </header>
      <div className='container'>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RootLayout
