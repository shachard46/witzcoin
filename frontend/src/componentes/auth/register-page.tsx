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
import { RegisterUser, Role } from './models'

const register = async (api: AxiosInstance, registerUser: RegisterUser) => {
  try {
    const res = await api.post('users', registerUser)
    return res
  } catch (error) {
    alert('False Creds')
    return undefined
  }
}
const RegisterPage: React.FC = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [balance, setBalance] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }
  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setBalance(parseInt(event.target.value))
    } catch {
      setBalance(0)
      alert('only numbers')
    }
  }

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const registerUser: RegisterUser = {
      username: username,
      password: password,
      balance: balance,
      pending: 0,
      role: Role.USER,
    }
    const res = await register(api, registerUser)
    if (res) {
      navigate('/login')
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
          הירשם
        </Typography>
        <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-1'>
        <TextField
          variant='outlined'
          margin='normal'
          required
          className='rounded-[10px] bg-white'
          fullWidth
          id='username'
          label='Username'
          name='username'
          autoComplete='username'
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
        <TextField
          variant='outlined'
          margin='normal'
          required
          className='rounded-[10px] bg-white'
          fullWidth
          id='balance'
          label='balance'
          name='balance'
          autoComplete='balance'
          autoFocus
          value={balance}
          onChange={handleBalanceChange}
        />
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 3, mb: 1, py: 1.25 }}>
          הירשם
        </Button>
        </form>
      </div>
    </Container>
  )
}

export default RegisterPage
