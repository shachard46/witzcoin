import { Container, Typography } from '@mui/material'
import { useAuth } from './auth/auth-provider'
import { useTransactions } from './transaction/transactions-provider'
import { TransactionsList } from './transaction/transactions-list'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
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
            עסקאות:
          </Typography>
          <TransactionsList user={true} />
        </div>
      </Container>
    </div>
  )
}

export default ProfilePage
