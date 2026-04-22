import { ArrowForward } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
import { RegisterUser, Role } from './models'

const register = async (api: AxiosInstance, registerUser: RegisterUser) => {
  try {
    const res = await api.post('users', registerUser)
    return res
  } catch {
    alert('False Creds')
    return undefined
  }
}

const iconAdornment = (name: string) => (
  <InputAdornment position='start'>
    <Box
      component='span'
      className='material-symbols-outlined text-outline-variant text-[20px]'
      sx={{ fontVariationSettings: "'FILL' 0" }}
    >
      {name}
    </Box>
  </InputAdornment>
)

export const RegisterForm: React.FC = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }
    if (!termsAccepted) {
      return
    }
    if (!fullName.trim()) {
      alert('Please enter your full name.')
      return
    }
    const registerUser: RegisterUser = {
      email: email.trim(),
      fullName: fullName.trim(),
      password,
      balance: 0,
      pending: 0,
      role: Role.USER,
    }
    const res = await register(api, registerUser)
    if (res) {
      navigate('/login')
    }
  }

  return (
    <Stack spacing={0}>
      <Stack spacing={1} className='mb-gutter text-center'>
        <Typography component='h1' className='font-h2 text-h2 text-on-surface'>
          Create Your Account
        </Typography>
        <Typography className='font-body-md text-body-md text-secondary'>
          Join the institutional grade escrow platform.
        </Typography>
      </Stack>

      <Box component='form' noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            id='fullName'
            name='fullName'
            label='Full Name'
            autoComplete='name'
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className={authOutlinedFieldClassName}
            InputProps={{ startAdornment: iconAdornment('person') }}
          />
          <TextField
            required
            fullWidth
            id='email'
            name='email'
            label='Email Address'
            type='email'
            autoComplete='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={authOutlinedFieldClassName}
            InputProps={{ startAdornment: iconAdornment('mail') }}
          />
          <TextField
            required
            fullWidth
            id='password'
            name='password'
            label='Password'
            type='password'
            autoComplete='new-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={authOutlinedFieldClassName}
            InputProps={{ startAdornment: iconAdornment('lock') }}
          />
          <TextField
            required
            fullWidth
            id='confirmPassword'
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            autoComplete='new-password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={authOutlinedFieldClassName}
            InputProps={{ startAdornment: iconAdornment('lock_reset') }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                required
                className='text-primary-container'
              />
            }
            label={
              <Typography className='font-body-md text-body-md text-secondary leading-snug'>
                I agree to the{' '}
                <Link href='#' className='text-on-surface font-semibold underline'>
                  Terms of Service
                </Link>
              </Typography>
            }
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            disableElevation
            endIcon={<ArrowForward />}
            className={`${authPrimarySubmitButtonClassName} mt-2`}
            sx={{
              bgcolor: 'var(--color-primary-container)',
              color: 'var(--color-on-primary)',
              '&:hover': {
                bgcolor: 'var(--color-primary-fixed)',
                color: 'var(--color-on-primary-fixed)',
              },
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Box>

      <Box className='border-surface-variant mt-8 border-t pt-6 text-center'>
        <Typography className='font-body-md text-body-md text-secondary'>
          Already have an account?{' '}
          <Link
            component={NavLink}
            to='/login'
            className='text-on-surface hover:text-primary-container ml-1 font-semibold'
            underline='hover'
          >
            Log in instead
          </Link>
        </Typography>
      </Box>
    </Stack>
  )
}
