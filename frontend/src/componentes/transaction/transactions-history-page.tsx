import React from 'react'

import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { TransactionsList } from './transactions-list'

export const TransactionHistoryPage: React.FC = () => {
  return (
    <ProtectedPage reqScope={Role.USER}>
      <div
        className='container'
        style={{ width: '1300px', backgroundColor: '#f8f9fa' }}
      >
        <div
          className='container'
          style={{ width: '1100px', backgroundColor: '#f8f9fa' }}
        >
          <TransactionsList user={false} pending={[]} />
        </div>
      </div>
    </ProtectedPage>
  )
}
