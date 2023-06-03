import { TextField } from '@material-ui/core'
import React, { useState } from 'react'

export interface Params {
  [key: string]: string
}

const CommandParamsFields: React.FC<Params> = params => {
  const [values, setValues] = useState<Params>(params)

  const handleValuesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues(prevValues => ({
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
        value={values[param]}
        onChange={handleValuesChange}
      />,
    )
  }

  return <div>{fields}</div>
}

export default CommandParamsFields
