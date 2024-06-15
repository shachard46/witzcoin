import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination'
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
import { useTransactions } from './transactions-hook'
import { styled } from '@mui/material/styles'
import { Transaction } from './models'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#776a37',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#776a37',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export const TransactionsList: React.FC<{
  user: boolean
  pending: Transaction[]
}> = ({ user = false, pending = [] }) => {
  const [transactions, refreshTransactions] = useTransactions(user)

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

  useEffect(() => refreshTransactions(), [])
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table  stickyHeader aria-label='sticky collapsible table' dir='rtl'>
          <TableHead style={{ backgroundColor: '#776a37'}}>
            <StyledTableRow className='table-head'>
              <StyledTableCell />
              <StyledTableCell align='center'>שם העסקה</StyledTableCell>
              <StyledTableCell align='center'>שם הקונה</StyledTableCell>
              <StyledTableCell align='center'>שם המוכר</StyledTableCell>
              <StyledTableCell align='center'>שם העד</StyledTableCell>
              <StyledTableCell align='center'>מחיר</StyledTableCell>
              <StyledTableCell align='center'>קטגוריות</StyledTableCell>
              {pending.length > 0 ? (
                <StyledTableCell align='center'>אישור</StyledTableCell>
              ) : null}

              {/* {user ? <StyledTableCell align='center'>סטטוס</StyledTableCell> : null} */}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {(pending.length > 0 ? pending : transactions).map(transaction => (
              <TransactionRow
                key={transactions.indexOf(transaction)}
                transaction={transaction}
                pending={pending.length > 0 ? true : false}
                refreshTransactions={refreshTransactions}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomTablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
        colSpan={3}
        slotProps={{
          select: {
            'aria-label': 'rows per page',
          },
          actions: {
            showFirstButton: true,
            showLastButton: true,
          },
        }}
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`
