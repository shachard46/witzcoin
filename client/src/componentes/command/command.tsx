import { Button, Container, FormControl, Typography } from '@material-ui/core'
import { AxiosInstance } from 'axios'
import { FormEvent, useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useApi } from '../api/api-provider'
import { ProtectedPage } from '../protected/protected-page'
import { ThemeContext } from '../root-layout'
import CommandParamsFields, { Params } from './command-params'
import { useCommands } from './commands-provider'

export interface Command {
  name: string
  params: Params
}

const runCommand = (api: AxiosInstance, command: Command) => {
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
  const commands = useCommands()
  const api = useApi()
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
    setOutput(runCommand(api, command))
  }
  return (
    <ProtectedPage level={1}>
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
    </ProtectedPage>
  )
}

export default CommandPage
