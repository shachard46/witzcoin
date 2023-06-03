import {
  Button,
  Container,
  FormControl,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { ApiContext } from '../App'
import { ThemeContext } from './root-layout'

const AdminPage: React.FC = () => {
  const classes = useContext(ThemeContext)
  const api = useContext(ApiContext)
  const [allowIp, setAllowIp] = useState('')
  const [blockIp, setBlockIp] = useState('')

  const handleAllowIPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowIp(event.target.value)
  }

  const handleBlockIPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockIp(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent): void => {
    api
      .post('perms', { allow_ip: allowIp, block_ip: blockIp })
      .then(res => {})
      .catch(err => {})
  }

  return (
    <Container component='main' maxWidth='xs' className={classes.root}>
      <Typography align='center' component='h1' variant='h5'>
        IP Managment
      </Typography>
      <FormControl className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant='outlined'
              margin='normal'
              className={classes.textField}
              fullWidth
              id='allow_ip'
              label='Allow IP'
              name='allow_ip'
              autoComplete='192.100.1.12'
              autoFocus
              value={allowIp}
              onChange={handleAllowIPChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant='outlined'
              margin='normal'
              className={classes.textField}
              fullWidth
              id='block_ip'
              label='Block IP'
              name='block_ip'
              autoComplete='192.100.1.12'
              autoFocus
              value={blockIp}
              onChange={handleBlockIPChange}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={handleSubmit}
          >
            Change IP Permissions
          </Button>
        </Grid>
      </FormControl>
    </Container>
  )
}

export default AdminPage
