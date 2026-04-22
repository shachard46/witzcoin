import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination'
import type { ChipProps } from '@mui/material'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { ThemeProvider, styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import theme from '../theme'
import { useApi } from '../api/api-provider'
import { CategoryColors, Transaction } from './models'
import { TransactionRow } from './transaction-row'
import { useTransactions } from './transactions-hook'

const headCellClass =
  'border-surface-variant text-on-surface-variant font-label-caps text-label-caps border-b px-4 py-4 uppercase tracking-wider'

export const TransactionsList: React.FC<{
  user: boolean
  pending: Transaction[]
  className: string
}> = ({ user = false, pending = [], className = '' }) => {
  const [transactions, refreshTransactions] = useTransactions(user)

  const [page, setPage] = React.useState(0)
  const api = useApi()
  const [catColors, setCatColors] = useState<CategoryColors>({})
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const handleChangePage = (newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => {
    const getCategoriesColors = () => {
      api.get<[]>('/categories').then(res => {
        const categories = res.data
        const options: NonNullable<ChipProps['color']>[] = [
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
    }
    getCategoriesColors()
    refreshTransactions()
  }, [])

  const source = pending.length > 0 ? pending : transactions
  const pageRows = source.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage >= source.length
      ? source.length
      : (page + 1) * rowsPerPage,
  )

  return (
    <Paper
      elevation={0}
      className={`bg-surface-container-lowest shadow-layer w-full max-w-full overflow-x-auto rounded-2xl p-card-padding ${className}`.trim()}
    >
      <div className='border-surface-container-highest mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='relative'>
            <span className='material-symbols-outlined text-on-surface-variant pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px]'>
              search
            </span>
            <input
              readOnly
              className='border-outline-variant bg-surface text-on-surface font-body-md text-body-md focus:ring-primary-container h-12 w-64 max-w-full rounded-lg border py-2 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2'
              placeholder='Search transactions...'
              type='text'
              aria-label='Search transactions (coming soon)'
            />
          </div>
          <button
            type='button'
            className='border-outline-variant font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-low flex h-12 items-center gap-2 rounded-lg border px-4 py-2 uppercase transition-colors'
          >
            <span className='material-symbols-outlined text-sm'>filter_list</span>
            Filter
          </button>
        </div>
        <div className='flex flex-wrap items-center gap-4'>
          <button
            type='button'
            className='border-outline-variant font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-low flex h-12 items-center gap-2 rounded-lg border px-4 py-2 uppercase transition-colors'
          >
            <span className='material-symbols-outlined text-sm'>download</span>
            Export
          </button>
        </div>
      </div>

      <ThemeProvider theme={theme}>
        <TableContainer className='overflow-x-auto'>
          <Table
            stickyHeader
            dir='ltr'
            aria-label='sticky collapsible table'
            className='min-w-[800px] w-full'
          >
            <TableHead>
              <TableRow className='bg-surface-container-low'>
                <TableCell className={headCellClass} />
                <TableCell className={headCellClass}>Transaction Name</TableCell>
                <TableCell className={headCellClass}>Buyer</TableCell>
                <TableCell className={headCellClass}>Seller</TableCell>
                <TableCell className={headCellClass}>Witness</TableCell>
                <TableCell className={`${headCellClass} text-right`}>Price</TableCell>
                <TableCell className={headCellClass}>Categories</TableCell>
                <TableCell className={`${headCellClass} text-center`}>Status</TableCell>
                {pending.length > 0 ? (
                  <TableCell className={`${headCellClass} text-center`}>
                    Approval
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody className='divide-surface-variant divide-y'>
              {pageRows.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  pending={pending.length > 0 ? true : false}
                  refreshTransactions={refreshTransactions}
                  categoryColor={catColors}
                  striped={index % 2 === 1}
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
          onPageChange={(_, p) => handleChangePage(p)}
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
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-surface-container-highest, #e1e3e4);

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
