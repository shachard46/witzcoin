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
import { LoginUser, RegisterUser, Role } from './models'
import { useToken } from './token-provider'

const login = async (api: AxiosInstance, registerUser: RegisterUser) => {
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
  const [, refreshToken] = useToken()

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
    const registerUser: RegisterUser = { username: username, password: password, balance:balance,pending:0, role:Role.USER }
    const res = await login(api, registerUser)
    if (res) {
      refreshToken(JSON.stringify(res))
    }
  }

  return (
    <div className='container'>
      <Container component='main' maxWidth='xs' className='root'>
        <div>
          <Typography component='h1' variant='h5' align='center'>
            הירשם
          </Typography>
          <TextField
            variant='outlined'
            margin='normal'
            required
            className='textField'
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
              className='textField'
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
            className='textField'
            fullWidth
            id='balance'
            label='balance'
            name='balance'
            autoComplete='balance'
            autoFocus
            value={balance}
            onChange={handleBalanceChange}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className='submit'
            onClick={handleSubmit}
          >
            הירשם
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default RegisterPage
