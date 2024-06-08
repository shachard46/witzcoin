import styled from 'styled-components'
import { Container, Typography } from '@mui/material'
import { useAuth } from './auth/auth-hook'
import { TransactionsList } from './transaction/transactions-list'
import { ProtectedPage } from './protected/protected-page'
import { Role } from './auth/models'
import { useToken } from './auth/token-provider'
import { useApi } from './api/api-provider'

// Styled-components for styling
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

const UserName = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #343a40;
`

const UserBalance = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  color: #28a745;
`

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const api = useApi()
  // const [token] = useToken()

  return (
    <ProtectedPage reqScope={Role.USER}>
      <div className='container'>
        <ProfileContainer>
          <div>
            <Typography component='h1' variant='h5' align='center'>
              הפרופיל שלך
            </Typography>

            <UserName>שם: {user?.username}</UserName>

            <UserBalance>עו״ש: {user?.balance}</UserBalance>

            <Typography component='h1' variant='h5' align='center'>
              עסקאות:
            </Typography>
            <TransactionsList user={true} />
          </div>
        </ProfileContainer>
      </div>
    </ProtectedPage>
  )
}

export default ProfilePage
