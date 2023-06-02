import { TextField } from '@material-ui/core'
import React, { useState } from 'react'

export interface Params {
  [key: string]: string
}

const CommandParamsFields: React.FC<Params> = params => {
  const [values, setValues] = useState(params)
  const handleValuesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let temp = values
    temp[event.target.name] = event.target.value
    setValues(temp)
  }
  let fields: JSX.Element[] = []
  for (const param in params) {
    fields.push(
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        id={param}
        label={param}
        name={param}
        autoComplete={param}
        autoFocus
        value='{param}'
        onChange={handleValuesChange}
      />,
    )
  }
  return <div>{fields}</div>
}

export default CommandParamsFields
