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
import styled from '@emotion/styled'

const login = async (api: AxiosInstance, loginUser: LoginUser) => {
  try {
    const res = await api.post('login', loginUser, {})
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
    }
    navigate('/p/transaction')
  }
  // Styled-components for styling
  const LoginContainer = styled.div`
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  `

  return (
    <Container component='main' maxWidth='xs' className='root'>
      <LoginContainer>
        <Typography component='h1' variant='h5' align='center'>
          התחבר
        </Typography>
        <TextField
          variant='outlined'
          margin='normal'
          className='textField'
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
            className='textField'
            type={showPassword ? 'text' : 'password'}
            value={password}
            required
            fullWidth
            autoFocus
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
        {/* </div> */}
      </LoginContainer>
    </Container>
  )
}

export default LoginForm
