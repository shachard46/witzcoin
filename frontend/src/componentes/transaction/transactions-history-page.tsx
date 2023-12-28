import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useTransactions } from './transactions-provider'
import { TransactionRow } from './transaction-row'
import { TablePagination } from '@mui/base'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'

export const TransactionHistoryPage: React.FC = () => {
  const transactions = useTransactions()
  const [page, setPage] = React.useState(0)

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <ProtectedPage reqScope={Role.USER}>
      <Paper>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label='sticky collapsible table'>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>שם העסקה</TableCell>
                <TableCell align='center'>שם הקונה</TableCell>
                <TableCell align='center'>שם המוכר</TableCell>
                <TableCell align='center'>שם העד</TableCell>
                <TableCell align='center'>מחיר</TableCell>
                <TableCell align='center'>קטגוריות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(transaction => (
                <TransactionRow
                  key={transactions.indexOf(transaction)}
                  transaction={transaction}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </ProtectedPage>
  )
}
