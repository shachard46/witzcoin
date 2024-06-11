import styled from 'styled-components'
import { useAuth } from '../auth/auth-hook'
import { TransactionsList } from '../transaction/transactions-list'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import AccountDetails from './user-details'

// Styled-components for styling
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  if (!user) return null
  return (
    <ProtectedPage reqScope={Role.USER}>
      <div className='container' dir='rtl'>
        <ProfileContainer>
          <div>
            <AccountDetails user={user} />

            <TransactionsList user={true} pending={[]} />
          </div>
        </ProfileContainer>
      </div>
    </ProtectedPage>
  )
}

export default ProfilePage
