import React from 'react'

import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { TransactionsList } from './transactions-list'

export const TransactionHistoryPage: React.FC = () => {
  return (
    <ProtectedPage reqScope={Role.USER}>
      <div
        className='container'
        style={{ width: '1300px', backgroundColor: '#afaa96' }}
      >
        <div
          className='container'
          style={{ width: '1100px', backgroundColor: '#afaa96' }}
        >
          <TransactionsList user={false} pending={[]} />
        </div>
      </div>
    </ProtectedPage>
  )
}
