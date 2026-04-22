import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import type { ChipProps } from '@mui/material'
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { AxiosInstance } from 'axios'
import React, { useEffect, useState } from 'react'
import { useApi } from '../api/api-provider'
import { useAuth } from '../auth/auth-hook'
import {
  Approver,
  CategoryColors,
  Transaction,
  TransStatusUpdateDto,
  User,
} from './models'

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

const bodyCellClass = 'border-surface-variant border-b px-4 py-4'

export const TransactionRow: React.FC<{
  transaction: Transaction
  pending: boolean
  categoryColor: CategoryColors
  refreshTransactions: () => void
  striped?: boolean
}> = ({
  transaction,
  pending,
  categoryColor,
  refreshTransactions,
  striped = false,
}) => {
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
  const rowBg = striped ? 'bg-surface-bright' : ''
  const colspan = pending ? 9 : 8
  return (
    <React.Fragment>
      <TableRow
        hover
        role='checkbox'
        tabIndex={-1}
        className={`hover:bg-surface-container-lowest group transition-colors ${rowBg}`.trim()}
      >
        <TableCell className={bodyCellClass}>
          <IconButton
            aria-label='expand row'
            size='small'
            className='text-on-surface-variant hover:text-primary'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='left' className={`${bodyCellClass} text-on-surface font-medium`}>
          {transaction.transactionName}
        </TableCell>
        <TableCell align='left' className={`${bodyCellClass} text-on-surface-variant`}>
          {transaction.buyerUser}
        </TableCell>
        <TableCell align='left' className={`${bodyCellClass} text-on-surface-variant`}>
          {transaction.sellerUser}
        </TableCell>
        <TableCell align='left' className={`${bodyCellClass} text-on-surface-variant`}>
          {transaction.witnessUser}
        </TableCell>
        <TableCell align='right' className={`${bodyCellClass} text-on-surface font-data-mono text-data-mono font-medium`}>
          {formatPrice(transaction.price)}
        </TableCell>
        <TableCell align='left' className={`${bodyCellClass} border-b-0`}>
          <Box className='flex flex-wrap justify-start gap-2'>
            {transaction.category.map(c => (
              <Chip
                key={`${transaction.id}-${c}`}
                className={badgeClassForChipColor(categoryColor[c])}
                label={c}
                color={categoryColor[c]}
                variant='filled'
                size='small'
              />
            ))}
          </Box>
        </TableCell>
        {renderStatusCell(transaction.status)}
        {pending && dealStatus != 'העסקה נסגרה' ? (
          <TableCell align='center' className={bodyCellClass}>
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
                className='border-outline-variant font-label-caps text-label-caps text-on-surface-variant'
                variant='outlined'
                size='small'
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
                className='border-outline-variant font-label-caps text-label-caps text-on-surface-variant'
                variant='outlined'
                size='small'
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
          <TableCell align='center' className={`${bodyCellClass} py-3`}>
            <Button
              className='border-outline-variant font-label-caps text-label-caps text-on-surface-variant'
              variant='outlined'
              size='small'
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
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={colspan}
          align='left'
        >
          <Collapse in={open} timeout='auto'>
            <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }} className='text-on-surface border-surface-variant bg-surface-container-low border-b'>
              <Typography
                variant='subtitle1'
                component='div'
                className='font-body-md text-body-md mb-1 font-semibold'
              >
                פרטים נוספים
              </Typography>
              <Typography
                variant='body2'
                component='div'
                className='font-body-md text-body-md mb-3 whitespace-pre-wrap break-words leading-relaxed'
              >
                {transaction.details}
              </Typography>
              <Typography
                variant='subtitle1'
                component='div'
                className='font-body-md text-body-md mb-1 font-semibold'
              >
                סטטוס עסקה
              </Typography>
              <Typography
                variant='body2'
                className='font-body-md text-body-md break-words leading-relaxed'
                sx={{ lineHeight: 1.6, wordBreak: 'break-word' }}
              >
                {dealStatus}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

function formatPrice(price: number): string {
  return `${price.toLocaleString('en-US')} WZ`
}

function badgeClassForChipColor(
  muiColor: NonNullable<ChipProps['color']> | undefined,
): string {
  const base =
    '!rounded-full font-label-caps text-label-caps uppercase [&_.MuiChip-label]:px-3 [&_.MuiChip-label]:py-1'
  if (muiColor === 'secondary') {
    return `${base} !bg-secondary-fixed !text-on-secondary-fixed`
  }
  if (muiColor === 'primary') {
    return `${base} !bg-primary-fixed !text-on-primary-fixed-variant`
  }
  return `${base} !bg-tertiary-container !text-on-tertiary-container`
}

function statusPresentation(status: Approver): {
  label: string
  textClass: string
  dotClass: string
} {
  if (status === Approver.DECLINE) {
    return {
      label: 'Disputed',
      textClass: 'text-error',
      dotClass: 'h-2 w-2 shrink-0 rounded-full bg-error',
    }
  }
  if (status === Approver.ALL) {
    return {
      label: 'Released',
      textClass: 'text-surface-tint',
      dotClass: 'h-2 w-2 shrink-0 rounded-full bg-primary-container',
    }
  }
  if (status === Approver.NON) {
    return {
      label: 'Pending',
      textClass: 'text-on-surface-variant',
      dotClass:
        'h-2 w-2 shrink-0 rounded-full border-2 border-outline-variant',
    }
  }
  return {
    label: 'Pending',
    textClass: 'text-on-surface-variant',
    dotClass:
      'h-2 w-2 shrink-0 rounded-full border-2 border-outline-variant',
  }
}

function renderStatusCell(status: Approver) {
  const p = statusPresentation(status)
  return (
    <TableCell align='center' className={bodyCellClass}>
      <span
        className={`font-label-caps text-label-caps inline-flex items-center gap-1.5 uppercase ${p.textClass}`}
      >
        <span className={p.dotClass} />
        {p.label}
      </span>
    </TableCell>
  )
}
