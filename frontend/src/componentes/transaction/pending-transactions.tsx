import React, { useEffect } from 'react'
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
import { Approver } from './models'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'

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

export const PendingTransactions: React.FC<{}> = ({}) => {
  const [transactions, refreshTransactions] = useTransactions(true)

  const [page, setPage] = React.useState(0)

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }
  const pendingTransactionsList = transactions.filter(
    t => t.status <= Approver.ALL,
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
