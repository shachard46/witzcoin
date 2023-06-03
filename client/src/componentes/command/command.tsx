import { Button, Container, FormControl, Typography } from '@material-ui/core'
import { AxiosInstance } from 'axios'
import { FormEvent, useContext, useState } from 'react'
import { useApi } from '../api/api-provider'
import { ProtectedPage } from '../protected/protected-page'
import { ThemeContext } from '../root-layout'
import CommandParamsFields from './command-params'
import { useCommand } from './command-provider'
import { Command } from './models'

const runCommand = (api: AxiosInstance, command: Command) => {
  api
    .get(
      `commands/${command.name}/run?params=${JSON.stringify(command.params)}`,
    )
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
  const [output, setOutput] = useState('')
  const [command, setParams] = useCommand()
  const api = useApi()
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
          <CommandParamsFields/>
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
