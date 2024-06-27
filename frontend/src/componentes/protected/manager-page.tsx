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
import { styled, ThemeProvider } from '@mui/material/styles'
import theme, { StyledTableCell, StyledTableRow } from '../theme'
import { useApi } from '../api/api-provider'
import { User } from '../transaction/models'
import { ManagerRow } from './manager-row'
import { ProtectedPage } from './protected-page'

export const ManagersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [page, setPage] = React.useState(0)
  const api = useApi()
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
    api.get('/users').then(res => setUsers(res.data))
  }, [])

  return (
    <ProtectedPage reqScope='admin' className='table-container'>
      <Paper className='table'>
        <ThemeProvider theme={theme}>
          <TableContainer component={Paper}>
            <Table stickyHeader dir='rtl'>
              <TableHead style={{ backgroundColor: '#776a37' }}>
                <StyledTableRow className='table-head'>
                  <StyledTableCell align='center'>שם משתמש</StyledTableCell>
                  <StyledTableCell align='center'>עו"ש</StyledTableCell>
                  <StyledTableCell align='center'>הוספת כסף</StyledTableCell>
                  <StyledTableCell align='center'>הורדת כסף</StyledTableCell>
                  <StyledTableCell align='center'>שינוי</StyledTableCell>
                  <StyledTableCell align='center'>אישור</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <ManagerRow user={user} />
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
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ThemeProvider>
      </Paper>
    </ProtectedPage>
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
