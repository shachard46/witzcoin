import { AxiosInstance } from 'axios'
import { useEffect } from 'react'
import { deepEqual } from '../../utils'
import { Command } from '../command/command'

const useCommands = (
  api: AxiosInstance,
  context: Command[],
  setContext: Function,
) => {
  useEffect(() => {
    api
      .get<Command[]>('commands')
      .then(res => {
        if (!deepEqual(context, res.data)) {
          setContext(res.data)
        }
        return res.data
      })
      .catch(err => {
        return err
      })
  })
}

export default useCommands
