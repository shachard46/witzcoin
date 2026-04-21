import { useAuth } from '../auth/auth-hook'
import { TransactionsList } from '../transaction/transactions-list'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import AccountDetails from './user-details'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  if (!user) return null
  return (
    <ProtectedPage reqScope={Role.USER}>
      <div
        className='mx-auto my-4 min-h-[65vh] w-full max-w-6xl rounded-[10px] bg-[#d1c7a1] px-4 pb-6 sm:px-6'
        dir='rtl'
      >
        <div className='mx-auto max-w-[800px] rounded-lg bg-[#f8f9fa] p-6 shadow-[0_0_10px_rgba(0,0,0,0.1)] sm:p-8'>
          <div className='flex flex-col gap-6'>
            <AccountDetails user={user} />

            <TransactionsList user={true} pending={[]} className='min-w-0' />
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}

export default ProfilePage
