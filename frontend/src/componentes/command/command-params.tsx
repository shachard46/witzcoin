import { TextField } from '@material-ui/core'
import React from 'react'
import { Params } from './models'
import { useParams } from './params-provider'

const CommandParamsFields: React.FC = () => {
  const [params, setParams] = useParams()

  const handleValuesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setParams((prevValues: Params) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const fields: JSX.Element[] = []
  for (const param in params) {
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
        value={params[param]}
        onChange={handleValuesChange}
      />,
    )
  }

  return <div>{fields}</div>
}

export default CommandParamsFields
