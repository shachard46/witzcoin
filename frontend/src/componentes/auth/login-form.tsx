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
import * as bcrypt from 'bcrypt'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../api/api-provider'
import { LoginUser } from './models'
import { useToken } from './token-provider'

const login = async (api: AxiosInstance, loginUser: LoginUser) => {
  const form = new FormData()
  form.append('username', loginUser.username)
  form.append('password', await bcrypt.hash(loginUser.password, 10))
  try {
    const res = await api.post('login', form, {})
    return res
  } catch (error) {
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
      refreshToken(JSON.stringify(res))
      navigate('/p/commands')
    }
  }

  return (
    <div className='container'>
      <Container component='main' maxWidth='xs' className='root'>
        <div>
          <Typography component='h1' variant='h5' align='center'>
            Log In
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
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className='submit'
            onClick={handleSubmit}
          >
            Log In
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default LoginForm
