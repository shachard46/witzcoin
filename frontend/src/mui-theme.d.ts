import type {} from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    third: Palette['primary']
    fo: Palette['primary']
    fi: Palette['primary']
    si: Palette['primary']
    se: Palette['primary']
    ei: Palette['primary']
    ni: Palette['primary']
  }
  interface PaletteOptions {
    third?: PaletteOptions['primary']
    fo?: PaletteOptions['primary']
    fi?: PaletteOptions['primary']
    si?: PaletteOptions['primary']
    se?: PaletteOptions['primary']
    ei?: PaletteOptions['primary']
    ni?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    third: true
    fo: true
    fi: true
    si: true
    se: true
    ei: true
    ni: true
  }
}
