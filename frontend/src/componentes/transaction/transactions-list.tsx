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
  TableRow,
} from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import {
  lime,
  purple,
  indigo,
  red,
  teal,
  pink,
  cyan,
  amber,
  green,
} from '@mui/material/colors'
import { TransactionRow } from './transaction-row'
import { useTransactions } from './transactions-hook'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import { CategoryColors, Transaction } from './models'
import { useApi } from '../api/api-provider'

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
const theme = createTheme({
  palette: {
    primary: {
      main: '#3F51B5', // Blue
      light: '#757DE8',
      dark: '#002984',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F50057', // Pink
      light: '#FF4081',
      dark: '#C51162',
      contrastText: '#FFFFFF',
    },
    third: {
      main: '#4CAF50', // Green
      light: '#80E27E',
      dark: '#087F23',
      contrastText: '#FFFFFF',
    },
    fo: {
      main: '#FF9800', // Orange
      light: '#FFC947',
      dark: '#C66900',
      contrastText: '#FFFFFF',
    },
    fi: {
      main: '#9C27B0', // Purple
      light: '#D05CE3',
      dark: '#6A0080',
      contrastText: '#FFFFFF',
    },
    si: {
      main: '#00BCD4', // Cyan
      light: '#62EFFF',
      dark: '#008BA3',
      contrastText: '#FFFFFF',
    },
    se: {
      main: '#795548', // Brown
      light: '#A98274',
      dark: '#4B2C20',
      contrastText: '#FFFFFF',
    },
    ei: {
      main: '#607D8B', // Blue Grey
      light: '#8EACBB',
      dark: '#34515E',
      contrastText: '#FFFFFF',
    },
    ni: {
      main: '#E91E63', // Deep Pink
      light: '#FF6090',
      dark: '#B0003A',
      contrastText: '#FFFFFF',
    },
  },
})
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
          'fo',
          'fi',
          'si',
          'se',
          'ei',
          'ni',
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
