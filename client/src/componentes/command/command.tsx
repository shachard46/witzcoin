import { Button, Container, FormControl, Typography } from '@material-ui/core'
import { AxiosInstance } from 'axios'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useApi } from '../api/api-provider'
import { ProtectedPage } from '../protected/protected-page'
import { ThemeContext } from '../root-layout'
import CommandParamsFields from './command-params'
import { useCommands } from './commands-provider'
import { Command, Params } from './models'

const runCommand = (api: AxiosInstance, command: Command, params: Params) => {
  api
    .get(`commands/${command.name}/run?params=${JSON.stringify(params)}`)
    .then(res => {
      return JSON.stringify(res.data)
    })
    .catch(err => {
      return err
    })
  return ''
}

const getCommandFromQuery = (
  queryParams: URLSearchParams,
  commands: Command[],
) => {
  const commandName = queryParams.get('name')
  const command = commands.find(c => c.name === commandName)
  if (!command) {
    return null
  }
}

const CommandPage: React.FC = () => {
  const classes = useContext(ThemeContext)
  const commands = useCommands()
  const api = useApi()
  const location = useLocation()
  const navigate = useNavigate()
  const [output, setOutput] = useState('')
  const [command, setCommand] = useState<Command>()
  const [params, setParams] = useState<Params>({})
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const command = getCommandFromQuery(queryParams, commands)
    if (command) {
      setCommand(command)
    } else {
      navigate('/commands')
    }
  }, [command, commands, location.search, navigate])

  if (!command) {
    return null
  }
  const handleSubmit = (event: FormEvent) => {
    setOutput(runCommand(api, command, params))
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
