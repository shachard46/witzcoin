import { Container, Typography } from '@mui/material'
import { useAuth } from './auth/auth-hook'
import { TransactionsList } from './transaction/transactions-list'
import { ProtectedPage } from './protected/protected-page'
import { Role } from './auth/models'
import { useToken } from './auth/token-provider'
import { SetStateAction, useEffect, useState } from 'react'
import { User } from './transaction/models'
import { useApi } from './api/api-provider'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const api = useApi()
  // const [token] = useToken()

  return (
    <ProtectedPage reqScope={Role.USER}>
      <div className='container'>
        <Container component='main' maxWidth='xs' className='root'>
          <div>
            <Typography component='h1' variant='h5' align='center'>
              הפרופיל שלך
            </Typography>

            <Typography component='h1' variant='h5' align='center'>
              שם: {user?.username}
            </Typography>

            <Typography component='h1' variant='h5' align='center'>
              עו״ש: {user?.balance}
            </Typography>

            <Typography component='h1' variant='h5' align='center'>
              עסקאות:
            </Typography>
            <TransactionsList user={true} />
          </div>
        </Container>
      </div>
    </ProtectedPage>
  )
}

export default ProfilePage
