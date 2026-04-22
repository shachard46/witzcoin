import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { AxiosInstance } from 'axios'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApi } from '../api/api-provider'
import {
  authOutlinedFieldClassName,
  authPrimarySubmitButtonClassName,
} from './auth-form-classes'
import { AuthPublicShell } from './auth-public-shell'
import { LoginUser } from './models'
import { useToken } from './token-provider'

const login = async (api: AxiosInstance, loginUser: LoginUser) => {
  try {
    return await api.post<{
      access_token: string
      refresh_token?: string
      profileIncomplete?: boolean
    }>('login', loginUser)
  } catch {
    alert('False Creds')
    return undefined
  }
}

const SignInForm: React.FC = () => {
  const api = useApi()
  const [, refreshToken] = useToken()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const loginUser: LoginUser = { email: email.trim(), password }
    const res = await login(api, loginUser)
    if (res) {
      refreshToken(JSON.stringify({ data: res.data }))
      navigate('/p/transaction')
    }
  }

  return (
    <Stack spacing={0}>
      <Stack spacing={1} className='mb-gutter text-center'>
        <Typography component='h1' className='font-h2 text-h2 text-on-surface'>
          Welcome Back
        </Typography>
        <Typography className='font-body-md text-body-md text-secondary mt-2'>
          Access your secure escrow vault
        </Typography>
      </Stack>

      <Box component='form' noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            id='email'
            name='email'
            label='Email Address'
            type='email'
            autoComplete='username'
            placeholder='you@example.com or account id'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={authOutlinedFieldClassName}
          />

          <Box>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              className='mb-2'
            >
              <Box
                component='label'
                htmlFor='login-password'
                className='font-label-caps text-label-caps text-secondary uppercase'
              >
                Password
              </Box>
              <Link
                href='#'
                underline='hover'
                className='font-body-md text-primary hover:text-primary-container text-sm'
              >
                Forgot password?
              </Link>
            </Stack>
            <TextField
              required
              fullWidth
              hiddenLabel
              id='login-password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              placeholder='••••••••'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={authOutlinedFieldClassName}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword(v => !v)}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className='pt-4'>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              disableElevation
              endIcon={<LockOutlined />}
              className={authPrimarySubmitButtonClassName}
              sx={{
                bgcolor: 'var(--color-primary-container)',
                color: 'var(--color-on-primary)',
                '&:hover': {
                  bgcolor: 'var(--color-primary-fixed)',
                  color: 'var(--color-on-primary-fixed)',
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Stack>
      </Box>

      <Box className='mt-8 text-center'>
        <Typography className='font-body-md text-body-md text-secondary'>
          New to Witzcoin?{' '}
          <Link
            component={NavLink}
            to='/register'
            className='text-primary hover:text-primary-container font-medium underline decoration-primary/30 underline-offset-4'
            underline='hover'
          >
            Create an account
          </Link>
        </Typography>
      </Box>
    </Stack>
  )
}

const LoginForm: React.FC = () => {
  return (
    <AuthPublicShell cardClassName='rounded-2xl shadow-layer'>
      <SignInForm />
    </AuthPublicShell>
  )
}

export default LoginForm
