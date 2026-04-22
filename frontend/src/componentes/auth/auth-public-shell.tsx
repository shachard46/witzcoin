import { Box, Paper } from '@mui/material'
import React from 'react'

export type AuthPublicShellProps = {
  children: React.ReactNode
  /** Extra classes on the card Paper (e.g. rounded-2xl for signup vs rounded-xl for login). */
  cardClassName?: string
}

export const AuthPublicShell: React.FC<AuthPublicShellProps> = ({
  children,
  cardClassName = '',
}) => {
  return (
    <Box
      className='text-on-surface flex w-full min-w-0 flex-col items-center justify-center px-4 py-6 antialiased selection:bg-primary-container selection:text-on-primary sm:py-8 md:px-10 min-h-[calc(100dvh-8rem)]'
      component='div'
    >
      <Paper
        elevation={0}
        className={`relative w-full max-w-md overflow-hidden border-0 bg-primary-fixed-dim/30 p-card-padding shadow-md shadow-primary-container/20 sm:max-w-lg ${cardClassName}`.trim()}
      >
        {children}
      </Paper>
    </Box>
  )
}
