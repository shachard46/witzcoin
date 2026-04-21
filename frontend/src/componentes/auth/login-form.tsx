import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import { AxiosInstance } from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../api/api-provider'
import { LoginUser } from './models'
import { useToken } from './token-provider'

const login = async (api: AxiosInstance, loginUser: LoginUser) => {
  try {
    return await api.post<{ access_token: string }>('login', loginUser)
  } catch {
    alert('False Creds')
    return undefined
  }
}

const LoginForm: React.FC = () => {
  const api = useApi()
  const [, refreshToken] = useToken()

  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const loginUser: LoginUser = { username: username, password: password }
    const res = await login(api, loginUser)
    if (res) {
      refreshToken(JSON.stringify({ data: res.data }))
      navigate('/p/transaction')
    }
  }

  return (
    <Container
      component='main'
      maxWidth='xs'
      className='mt-6 rounded-[10px] bg-[#d1c7a1] px-4 py-12 sm:mt-10 sm:py-20'
    >
      <div className='mx-auto max-w-[800px] rounded-lg bg-[#f8f9fa] p-6 shadow-[0_0_10px_rgba(0,0,0,0.1)] sm:p-8'>
        <Typography component='h1' variant='h5' align='center' gutterBottom sx={{ mb: 3 }}>
          התחבר
        </Typography>
        <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-1'>
        <TextField
          variant='outlined'
          margin='normal'
          className='rounded-[10px] bg-white'
          id='username'
          label='Username'
          name='username'
          autoComplete='username'
          required
          fullWidth
          autoFocus
          value={username}
          onChange={handleUsernameChange}
        />
        <FormControl variant='outlined' margin='normal' required fullWidth>
          <InputLabel htmlFor='password'>Password</InputLabel>
          <OutlinedInput
            id='password'
            name='password'
            className='rounded-[10px] bg-white'
            type={showPassword ? 'text' : 'password'}
            value={password}
            required
            fullWidth
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={handleShowPasswordToggle} edge='end'>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          sx={{ mt: 3, mb: 1, py: 1.25 }}
        >
          Log In
        </Button>
        </form>
      </div>
    </Container>
  )
}

export default LoginForm
