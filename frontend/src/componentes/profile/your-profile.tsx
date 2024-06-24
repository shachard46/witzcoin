import { useAuth } from '../auth/auth-hook'
import { TransactionsList } from '../transaction/transactions-list'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import AccountDetails from './user-details'
import { styled } from '@mui/styles'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  if (!user) return null
  return (
    <ProtectedPage reqScope={Role.USER}>
      <div className='container' dir='rtl'>
        <div className='profile-container'>
          <div>
            <AccountDetails user={user} />

            <TransactionsList user={true} pending={[]} />
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}

export default ProfilePage
