import React, { useEffect, useState } from 'react'
import { Transaction, TransStatusUpdateDto, User } from './models'
import {
  Box,
  Button,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { AxiosInstance } from 'axios'
import { useAuth } from '../auth/auth-hook'
import { useApi } from '../api/api-provider'

const approveTransaction = async (
  api: AxiosInstance,
  user: User | null,
  tId: number,
  decline: boolean,
  refreshTransactions: () => void,
) => {
  if (
    window.confirm(
      `Are you sure you wish to ${decline ? 'reject' : 'approve'} this item?`,
    )
  )
    try {
      if (!user) return false
      const data: TransStatusUpdateDto = {
        approvingUser: user,
        decline: decline,
      }
      const res = await api.put(`transactions/waiting/${tId}`, data)
      refreshTransactions()
      return res
    } catch (error) {
      alert('False Creds')
      return undefined
    }
}
const invalidateTransaction = async (
  api: AxiosInstance,
  user: User | null,
  tId: number,
  refreshTransactions: () => void,
) => {
  if (window.confirm(`Are you sure you wish to invalidate this item?`))
    try {
      if (!user) return false
      const data: { user: User } = { user: user }
      const res = await api.put(`transactions/invalidate/${tId}`, data)
      refreshTransactions()
      return res
    } catch (error) {
      alert('False Creds')
      return undefined
    }
}

export const TransactionRow: React.FC<{
  transaction: Transaction
  pending: boolean
  refreshTransactions: () => void
}> = ({ transaction, pending, refreshTransactions }) => {
  const [open, setOpen] = React.useState(false)
  const { user } = useAuth()
  const api = useApi()
  const [dealStatus, setDealStatus] = useState('')

  useEffect(() => {
    const getDealStatus = async () => {
      try {
        const response = await api.get<User[]>(
          `transactions/waiting/${transaction.id}`,
        )
        const approvers = response.data
        if (approvers.length === 0) {
          setDealStatus('העסקה נסגרה')
        } else {
          setDealStatus(
            `המשתמשים שעדיין לא אישרו את העסקה הם: ${approvers
              .map(a => a.username)
              .join(', ')}`,
          )
        }
      } catch (error) {
        setDealStatus(`Error: ${error}`)
      }
    }

    getDealStatus()
  }, [transaction.id])

  return (
    <React.Fragment>
      <TableRow hover role='checkbox' tabIndex={-1}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='center'>{transaction.transactionName}</TableCell>
        <TableCell align='center'>{transaction.buyerUser}</TableCell>
        <TableCell align='center'>{transaction.sellerUser}</TableCell>
        <TableCell align='center'>{transaction.witnessUser}</TableCell>
        <TableCell align='center'>{transaction.price}</TableCell>
        <TableCell align='center'>{transaction.category}</TableCell>
        {pending && dealStatus != 'העסקה נסגרה' ? (
          <TableCell align='center'>
            <Button
              onClick={() =>
                approveTransaction(
                  api,
                  user,
                  transaction.id,
                  false,
                  refreshTransactions,
                )
              }
            >
              אשר
            </Button>
            <Button
              onClick={() =>
                approveTransaction(
                  api,
                  user,
                  transaction.id,
                  true,
                  refreshTransactions,
                )
              }
            >
              דחה
            </Button>
          </TableCell>
        ) : pending && dealStatus == 'העסקה נסגרה' ? (
          <TableCell align='center'>
            <Button
              onClick={() =>
                invalidateTransaction(
                  api,
                  user,
                  transaction.id,
                  refreshTransactions,
                )
              }
            >
              העסקה הופרה
            </Button>
          </TableCell>
        ) : null}
        {/*need to expand to list */}
      </TableRow>
      <TableCell
        style={{ paddingBottom: 0, paddingTop: 0 }}
        colSpan={7}
        align='right'
      >
        <Collapse in={open} timeout='auto'>
          <Box margin={1}>
            <Typography variant='h6' gutterBottom component='div'>
              פרטים נוספים
            </Typography>
            <div>{transaction.details}</div>
            <Typography variant='h6' gutterBottom component='div'>
              סטטוס עסקה
            </Typography>
            <div>{dealStatus}</div>
          </Box>
        </Collapse>
      </TableCell>
    </React.Fragment>
  )
}
