import React from 'react'

import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { TransactionsList } from './transactions-list'

export const TransactionHistoryPage: React.FC = () => {
  return (
    <ProtectedPage reqScope={Role.USER} className='w-full'>
      <header className='mb-8'>
        <h1 className='font-h2 text-h2 text-on-surface mb-2'>Transaction History</h1>
        <p className='font-body-md text-body-md text-on-surface-variant'>
          Review your complete ledger of escrow transactions.
        </p>
      </header>
      <TransactionsList
        user={false}
        pending={[]}
        className='w-full min-w-0'
      />
    </ProtectedPage>
  )
}
