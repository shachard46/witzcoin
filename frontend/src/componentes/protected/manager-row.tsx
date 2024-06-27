import React, { useState } from 'react'
import { User } from '../transaction/models'
import {
  Button,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material'
import { AxiosInstance } from 'axios'
import { useApi } from '../api/api-provider'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const changeBalance = async (
  api: AxiosInstance,
  user: User | null,
  change: number,
) => {
  if (window.confirm(`Are you sure you wish change ${user}'s balance?`))
    try {
      if (!user) return false
      const res = await api.put(`users/balance/${user.username}`, {
        balance: change - user.balance,
      })
      return res
    } catch (error) {
      alert('False Creds')
      return undefined
    }
}

const handleChange = (event, setChange) => {
  if (event.target.value.toString().includes('Na')) setChange(0)
  else setChange(Number.parseInt(event.target.value))
  //   ? (event.target.value = '0')
}

export const ManagerRow: React.FC<{
  user: User
}> = ({ user }) => {
  const [change, setChange] = useState<number>(user.balance)
  const api = useApi()
  return (
    <React.Fragment>
      <TableRow hover role='checkbox' tabIndex={-1}>
        <TableCell align='center'>{user.username}</TableCell>
        <TableCell
          align='center'
          className={
            user.balance == change
              ? 'not'
              : user.balance >= change
                ? 'red'
                : 'green'
          }
        >
          <TextField
            required
            value={change}
            id={user.username + 'balance'}
            // onChange={event => handleChange(event, setChange)}
            onChangeCapture={event => handleChange(event, setChange)}
          />
        </TableCell>
        <TableCell align='center'>
          <IconButton
            color='primary'
            aria-label='add'
            onClick={() => setChange(change + 1)}
          >
            <AddIcon />
          </IconButton>
        </TableCell>
        <TableCell align='center'>
          <IconButton
            color='primary'
            aria-label='minus'
            onClick={() => setChange(change - 1)}
          >
            <RemoveIcon />
          </IconButton>
        </TableCell>
        <TableCell
          align='center'
          className={
            change - user.balance == 0
              ? 'not'
              : change - user.balance < 0
                ? 'red'
                : 'green'
          }
        >
          {change - user.balance}
        </TableCell>
        <TableCell align='center'>
          <Button onClick={() => changeBalance(api, user, change)}>
            אישור
          </Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
