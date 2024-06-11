import React, { useEffect, useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { TransactionRow } from './transaction-row'
import { TablePagination } from '@mui/base'
import { useTransactions } from './transactions-hook'
import { styled } from '@mui/material/styles'
import { Approver, Transaction, User } from './models'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { useAuth } from '../auth/auth-hook'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const isYourPendingTransactions = (user: User | null, t: Transaction) => {
  let role = Approver.NON
  if (t.buyerUser == user?.username) role = Approver.BUYER
  else if (t.sellerUser == user?.username) role = Approver.SELLER
  else if (t.witnessUser == user?.username) role = Approver.WITNESS
  else return false

  if (t.status == Approver.ALL) return true
  if (t.status == Approver.NON) return false
  if (role == Approver.BUYER && t.status % 2 != 0) return true
  if (role == Approver.WITNESS && t.status >= 4) return true
  if (
    role == Approver.SELLER &&
    (t.status % 3 == 0 || t.status == Approver.SELLER)
  )
    return true
  return false
}

export const PendingTransactions: React.FC = () => {
  const [transactions, refreshTransactions] = useTransactions(true)
  const { user } = useAuth()
  const [page, setPage] = React.useState(0)

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }
  const [pendingTransactionsList] = useState<Transaction[]>(
    transactions.filter(t => isYourPendingTransactions(user, t)),
  )
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => refreshTransactions(), [])
  return (
    <ProtectedPage reqScope={Role.USER}>
      <Paper>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label='sticky collapsible table' dir='rtl'>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell />
                <StyledTableCell>שם העסקה</StyledTableCell>
                <StyledTableCell align='center'>שם הקונה</StyledTableCell>
                <StyledTableCell align='center'>שם המוכר</StyledTableCell>
                <StyledTableCell align='center'>שם העד</StyledTableCell>
                <StyledTableCell align='center'>מחיר</StyledTableCell>
                <StyledTableCell align='center'>קטגוריות</StyledTableCell>
                <StyledTableCell align='center'>אישור</StyledTableCell>
                {/* {user ? <StyledTableCell align='center'>סטטוס</StyledTableCell> : null} */}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {pendingTransactionsList.map(transaction => (
                <TransactionRow
                  key={pendingTransactionsList.indexOf(transaction)}
                  transaction={transaction}
                  pending={true}
                  refreshTransactions={refreshTransactions}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          count={pendingTransactionsList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </ProtectedPage>
  )
}
