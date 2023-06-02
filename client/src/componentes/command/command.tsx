import { Button, Container, FormControl, Typography } from '@material-ui/core'
import { FormEvent, useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { CommandsContext } from '../../App'
import api from '../hooks/api'
import { ThemeContext } from '../root-layout'
import CommandParamsFields, { Params } from './command-params'

export interface Command {
  name: string
  params: Params
}

const runCommand = (command: Command) => {
  api
    .get(`commands/${command.name}/run`)
    .then(res => {
      return JSON.stringify(res.data)
    })
    .catch(err => {
      return err
    })
  return ''
}

const CommandPage: React.FC = () => {
  const classes = useContext(ThemeContext)
  const [commands, set] = useContext(CommandsContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [output, setOutput] = useState('')
  const queryParams = new URLSearchParams(location.search)
  const commandName = queryParams.get('name')
  const command = commands.find(c => c.name === commandName)
  if (!command) {
    navigate('/commands')
    return <div></div>
  }
  const handleSubmit = (event: FormEvent) => {
    setOutput(runCommand(command))
  }
  return (
    <Container component='main' maxWidth='xs' className={classes.root}>
      <Typography align='center' component='h1' variant='h5'>
        {command.name}
      </Typography>
      <FormControl className={classes.form}>
        <CommandParamsFields {...command.params} />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
          onClick={handleSubmit}
        >
          Run Command
        </Button>
      </FormControl>
      <Typography align='center' component='h1' variant='h5'>
        Output:
      </Typography>
      <Typography align='center'>{output}</Typography>
    </Container>
  )
}

export default CommandPage
