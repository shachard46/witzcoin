import React from 'react'
import { Approver, Transaction } from './models'
import {
  Button,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export const TransactionRow: React.FC<{
  transaction: Transaction
  pending: boolean
}> = ({ transaction, pending }) => {
  const [open, setOpen] = React.useState(false)

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
        {pending ? (
          <TableCell align='center'>
            <Button>אשר</Button>
          </TableCell>
        ) : null}
        {/*need to expand to list */}
      </TableRow>
      <TableRow>
        <Collapse in={open}>
          <div>פרטים נוספים: {transaction.details}</div>
          <div>סטטוס עסקה: {transaction.status}</div>
        </Collapse>
      </TableRow>
    </React.Fragment>
  )
}
