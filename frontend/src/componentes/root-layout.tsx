import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Role } from './auth/models'
import { ProtectedPage } from './protected/protected-page'
import { Box } from '@mui/material'

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
    <div className='min-h-screen bg-[#d1c7a1] pb-5'>
      <div className='mb-5 flex w-full justify-center'>
        <header className='flex min-h-[100px] w-[min(96%,1400px)] flex-wrap items-center gap-4 bg-[#776a37] px-4 py-3 sm:px-6 sm:py-4 md:px-8'>
          <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
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
          <nav className='min-w-0 flex-1'>
            <ul className='m-0 flex w-full flex-col gap-2 p-0 list-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
              <div className='flex min-w-0 flex-1 flex-wrap items-center gap-1 sm:gap-2'>
                <ProtectedPage
                  className='rounded-lg px-3 py-2 text-base text-white transition-colors duration-300 hover:font-bold hover:text-[#eaeaea] sm:text-lg'
                  reqScope={Role.USER}
                >
                  <li>
                    <NavLink to='/p/transaction'>צור עסקה</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage
                  className='rounded-lg px-3 py-2 text-base text-white transition-colors duration-300 hover:font-bold hover:text-[#eaeaea] sm:text-lg'
                  reqScope={Role.ADMIN}
                >
                  <li>
                    <NavLink to='/p/manage'>מנהל</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage
                  className='rounded-lg px-3 py-2 text-base text-white transition-colors duration-300 hover:font-bold hover:text-[#eaeaea] sm:text-lg'
                  reqScope={Role.USER}
                >
                  <li>
                    <NavLink to='/p/profile'>פרופיל</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage
                  className='rounded-lg px-3 py-2 text-base text-white transition-colors duration-300 hover:font-bold hover:text-[#eaeaea] sm:text-lg'
                  reqScope={Role.USER}
                >
                  <li>
                    <NavLink to='/p/history'>הסטוריה</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage
                  className='rounded-lg px-3 py-2 text-base text-white transition-colors duration-300 hover:font-bold hover:text-[#eaeaea] sm:text-lg'
                  reqScope={Role.USER}
                >
                  <li>
                    <NavLink to='/p/pending'>ממתינות</NavLink>
                  </li>
                </ProtectedPage>
              </div>
              <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
                <ProtectedPage
                  className='rounded-lg bg-[#444] px-3 py-2 text-base text-white transition-colors duration-300 hover:font-bold hover:text-[#eaeaea] sm:text-lg'
                  reqScope={Role.OUT}
                >
                  <li>
                    <NavLink to='/register'>הירשם</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage
                  className='rounded-lg bg-[#444] px-3 py-2 text-base text-white transition-colors duration-300 hover:font-bold hover:text-[#eaeaea] sm:text-lg'
                  reqScope={Role.OUT}
                >
                  <li>
                    <NavLink to='/login'>התחבר</NavLink>
                  </li>
                </ProtectedPage>
                <ProtectedPage
                  className='rounded-lg bg-[#444] px-3 py-2 text-base text-white transition-colors duration-300 hover:font-bold hover:text-[#eaeaea] sm:text-lg'
                  reqScope={Role.USER}
                >
                  <li>
                    <NavLink to='/logout'>התנתק</NavLink>
                  </li>
                </ProtectedPage>
              </div>
            </ul>
          </nav>
        </header>
      </div>
      <div className='mx-auto my-4 min-h-[65vh] w-full max-w-6xl rounded-[10px] bg-[#d1c7a1] px-4 pb-6 sm:px-6'>
        <main className='h-full min-w-0' dir='rtl'>
          <div className='w-full rounded-[10px] bg-[#a59a71] px-4 py-3 text-base font-bold text-[#776a37] sm:px-6 sm:py-4 sm:text-lg'>
            {path}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RootLayout
