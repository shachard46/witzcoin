import styled from '@emotion/styled'
import { TableCell, tableCellClasses, TableRow } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#776a37', // Muted brownish-yellow
      light: '#a49764',
      dark: '#4e451e',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#336a77', // Teal
      light: '#639ca3',
      dark: '#004349',
      contrastText: '#FFFFFF',
    },
    third: {
      main: '#776a89', // Muted purple
      light: '#a497b5',
      dark: '#4e4a5d',
      contrastText: '#FFFFFF',
    },
    fo: {
      main: '#774a4a', // Muted red
      light: '#a37575',
      dark: '#502d2d',
      contrastText: '#FFFFFF',
    },
    fi: {
      main: '#4a774a', // Olive green
      light: '#74a374',
      dark: '#255125',
      contrastText: '#FFFFFF',
    },
    si: {
      main: '#775a33', // Muted orange-brown
      light: '#a38d66',
      dark: '#503d1d',
      contrastText: '#FFFFFF',
    },
    se: {
      main: '#4a5a77', // Steel blue
      light: '#7489a3',
      dark: '#253049',
      contrastText: '#FFFFFF',
    },
    ei: {
      main: '#775a77', // Muted magenta
      light: '#a38da3',
      dark: '#503d50',
      contrastText: '#FFFFFF',
    },
    ni: {
      main: '#6a774a', // Moss green
      light: '#97a374',
      dark: '#455125',
      contrastText: '#FFFFFF',
    },
  },
})
export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#776a37',
    color:'white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#776a37',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))
export default theme
