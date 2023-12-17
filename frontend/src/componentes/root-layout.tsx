import { makeStyles } from '@material-ui/core/styles'
import { ClassNameMap } from '@material-ui/styles'
import React, { createContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ProtectedPage } from './protected/protected-page'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(7),
    width: 'wrap-content',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    backgroundColor: '#e0e0e0',
    borderRadius: theme.spacing(1),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  textField: {
    backgroundColor: 'white',
    borderRadius: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export const ThemeContext = createContext<ClassNameMap>({})

const RootLayout: React.FC = () => {
  const classes = useStyles()
  return (
    <div className='container'>
      <header className='header'>
        <nav>
          <ul className='nav-links'>
            <li className='nav-link'>
              <NavLink to='/p/deal'>צור עסקה</NavLink>
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
        <ThemeContext.Provider value={classes}>
          <Outlet />
        </ThemeContext.Provider>
      </main>
    </div>
  )
}

export default RootLayout
