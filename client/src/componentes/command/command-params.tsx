import { TextField } from '@material-ui/core'
import React from 'react'
import { useCommand } from './command-provider'
import { Params } from './models'

const CommandParamsFields: React.FC = () => {
  const [command, setParams] = useCommand()

  const handleValuesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setParams((prevValues: Params) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const fields: JSX.Element[] = []
  for (const param in command.params) {
    fields.push(
      <TextField
        key={param}
        variant='outlined'
        margin='normal'
        required
        fullWidth
        id={param}
        label={param}
        name={param}
        autoComplete={param}
        autoFocus
        value={command.params[param]}
        onChange={handleValuesChange}
      />,
    )
  }

  return <div>{fields}</div>
}

export default CommandParamsFields
