import React, { useEffect, useState } from 'react'
import {
  CategoryColors,
  Transaction,
  TransStatusUpdateDto,
  User,
} from './models'
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Theme,
  Typography,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { AxiosInstance } from 'axios'
import { useAuth } from '../auth/auth-hook'
import { useApi } from '../api/api-provider'
import { ThemeProvider } from '@mui/styles'

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
  categoryColor: CategoryColors
  theme: Theme
  refreshTransactions: () => void
}> = ({ transaction, pending, categoryColor, theme, refreshTransactions }) => {
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
      <ThemeProvider theme={theme}>
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
          <TableCell align='center' className='flex justify-center border-b-0'>
            {/* <Stack direction='row' spacing={1} width={'fit-content'}> */}
            {transaction.category.map(c => (
              <Chip
                className='mx-[3%]'
                label={c}
                color={categoryColor[c]}
                variant='filled'
              />
            ))}
            {/* </Stack> */}
          </TableCell>
          {pending && dealStatus != 'העסקה נסגרה' ? (
            <TableCell align='center'>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'center',
                  py: 0.5,
                }}
              >
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
              </Box>
            </TableCell>
          ) : pending && dealStatus == 'העסקה נסגרה' ? (
            <TableCell align='center' sx={{ py: 1.5 }}>
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
          colSpan={pending ? 9 : 7}
          align='right'
        >
          <Collapse in={open} timeout='auto'>
            <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
              <Typography variant='subtitle1' component='div' sx={{ fontWeight: 600, mb: 1 }}>
                פרטים נוספים
              </Typography>
              <Typography
                variant='body2'
                component='div'
                sx={{ mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.6, wordBreak: 'break-word' }}
              >
                {transaction.details}
              </Typography>
              <Typography variant='subtitle1' component='div' sx={{ fontWeight: 600, mb: 1 }}>
                סטטוס עסקה
              </Typography>
              <Typography variant='body2' sx={{ lineHeight: 1.6, wordBreak: 'break-word' }}>
                {dealStatus}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </ThemeProvider>
    </React.Fragment>
  )
}
