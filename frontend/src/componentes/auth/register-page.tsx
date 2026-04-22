import { Box } from '@mui/material'
import React from 'react'
import { AuthPublicShell } from './auth-public-shell'
import { RegisterForm } from './register-form'

const RegisterPage: React.FC = () => {
  return (
    <AuthPublicShell cardClassName='overflow-hidden rounded-2xl shadow-layer'>
      <BoxAccent />
      <RegisterForm />
    </AuthPublicShell>
  )
}

/** Top gradient accent line inside the card (matches signup mockup). */
const BoxAccent: React.FC = () => (
  <Box
    className='via-primary-container pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent opacity-50'
  />
)

export default RegisterPage
