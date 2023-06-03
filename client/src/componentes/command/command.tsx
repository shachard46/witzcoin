import { Button, Container, FormControl, Typography } from '@material-ui/core'
import { AxiosInstance } from 'axios'
import { FormEvent, useContext, useState } from 'react'
import { useApi } from '../api/api-provider'
import { ProtectedPage } from '../protected/protected-page'
import { ThemeContext } from '../root-layout'
import CommandParamsFields from './command-params'
import { useCommand } from './command-provider'
import { Command, Params } from './models'
import { ParamsProvider } from './params-provider'

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

const CommandPage: React.FC = () => {
  const classes = useContext(ThemeContext)
  const [output, setOutput] = useState('')
  const command = useCommand()
  const [params, setParams] = useState(command.params)
  const api = useApi()
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
          <ParamsProvider params={params} func={setParams}>
            <CommandParamsFields />
          </ParamsProvider>

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
