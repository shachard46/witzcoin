import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useApi } from '../api/api-provider'
import { useAuth } from './auth-hook'
import { authOutlinedFieldClassName } from './auth-form-classes'

function needsProfileCompletion(
  user: { email: string | null; fullName: string | null } | null,
): boolean {
  if (!user) return false
  return !user.email?.trim() || !user.fullName?.trim()
}

export const ProfileIncompleteBanner: React.FC = () => {
  const { user, isLoading, refetchUser } = useAuth()
  const api = useApi()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    if (user.email?.trim()) setEmail(user.email)
    if (user.fullName?.trim()) setFullName(user.fullName)
  }, [user])

  if (isLoading || !needsProfileCompletion(user)) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const em = email.trim().toLowerCase()
    const name = fullName.trim()
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError('Enter a valid email address.')
      return
    }
    if (!name) {
      setError('Enter your full name.')
      return
    }
    setSaving(true)
    try {
      await api.patch('users/me', { email: em, fullName: name })
      await refetchUser()
    } catch {
      setError('Could not save. Try again or pick a different email.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Alert severity='warning' className='mb-6' icon={false}>
      <Typography className='mb-3 font-medium'>
        Update your account with an email and full name to finish setting up your profile.
      </Typography>
      <Box component='form' onSubmit={handleSubmit}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems='flex-start'>
          <TextField
            required
            size='small'
            label='Email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={authOutlinedFieldClassName}
            sx={{ minWidth: 220 }}
          />
          <TextField
            required
            size='small'
            label='Full name'
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className={authOutlinedFieldClassName}
            sx={{ minWidth: 220 }}
          />
          <Button type='submit' variant='contained' disabled={saving} disableElevation>
            Save
          </Button>
        </Stack>
        {error ? (
          <Typography className='mt-2 text-sm text-error' role='alert'>
            {error}
          </Typography>
        ) : null}
      </Box>
    </Alert>
  )
}
