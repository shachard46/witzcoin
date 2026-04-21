import React from 'react'

import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { TransactionsList } from './transactions-list'

export const TransactionHistoryPage: React.FC = () => {
  return (
    <ProtectedPage reqScope={Role.USER} className='mt-auto flex justify-center px-4 py-6 sm:px-6'>
      <TransactionsList user={false} pending={[]} className='w-full max-w-5xl min-w-0' />
    </ProtectedPage>
  )
}
