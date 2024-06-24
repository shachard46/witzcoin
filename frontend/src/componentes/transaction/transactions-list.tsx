import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination'
import React, { useEffect, useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from '@mui/material'
import { TransactionRow } from './transaction-row'
import { useTransactions } from './transactions-hook'
import { styled, ThemeProvider } from '@mui/material/styles'
import theme, { StyledTableCell, StyledTableRow } from '../theme'
import { CategoryColors, Transaction } from './models'
import { useApi } from '../api/api-provider'

export const TransactionsList: React.FC<{
  user: boolean
  pending: Transaction[]
}> = ({ user = false, pending = [] }) => {
  const [transactions, refreshTransactions] = useTransactions(user)

  const [page, setPage] = React.useState(0)
  const api = useApi()
  const [catColors, setCatColors] = useState<CategoryColors>({})
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

  useEffect(() => {
    const getCategoriesColors = () => {
      api.get<[]>('/categories').then(res => {
        const categories = res.data
        const options = [
          'primary',
          'secondary',
          'third',
          'ni',
          'fo',
          'si',
          'fi',
          'se',
          'ei',
        ]
        const pair: CategoryColors = {}
        categories.forEach(
          c => (pair[c] = options[categories.indexOf(c) % options.length]),
        )
        setCatColors(pair)
      })

      // if (!deepEqual(pair, colors)) {
      // }
    }
    getCategoriesColors()
    refreshTransactions()
  }, [])
  return (
    <Paper>
      <ThemeProvider theme={theme}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label='sticky collapsible table' dir='rtl'>
            <TableHead style={{ backgroundColor: '#776a37' }}>
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
              {(pending.length > 0 ? pending : transactions).map(
                transaction => (
                  <TransactionRow
                    key={transactions.indexOf(transaction)}
                    transaction={transaction}
                    pending={pending.length > 0 ? true : false}
                    refreshTransactions={refreshTransactions}
                    categoryColor={catColors}
                    theme={theme}
                  />
                ),
              )}
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
      </ThemeProvider>
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
