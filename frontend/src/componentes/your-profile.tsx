import {
    Container,
  Typography,
} from '@mui/material'
import { useToken } from './auth/token-provider'
import { useApi } from './api/api-provider'
import { useEffect, useState } from 'react'
import { User } from './transaction/models'

const ProfilePage: React.FC = () => {
  const [token] = useToken()
  const api = useApi()
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }
    api
      .get(`user/${token?.access_token.username}`)
      .then(res => setUser(res.data))
  }, [user, setUser, token, api])
  return (
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
            הפרופיל שלך
          </Typography>
        </div>
      </Container>
    </div>
  )
}

export default ProfilePage
