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
} from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from './root-layout'

const login = (username: string, password: string) => {
  const form = new FormData()
  form.append('username', username)
  form.append('password', password)
  axios({
    method: 'post',
    url: 'http://localhost:5461/api/login',
    data: form,
  }).catch(err => {})
}

const LoginForm: React.FC = () => {
  const classes = useContext(ThemeContext)
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    login(username, password)
    navigate('/commands')
  }

  return (
    <Container component='main' maxWidth='xs' className={classes.root}>
      <div>
        <Typography component='h1' variant='h5' align='center'>
          Log In
        </Typography>
        <TextField
          variant='outlined'
          margin='normal'
          required
          className={classes.textField}
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
            className={classes.textField}
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
            labelWidth={70}
          />
        </FormControl>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
          onClick={handleSubmit}
        >
          Log In
        </Button>
      </div>
    </Container>
  )
}

export default LoginForm
