import React from 'react'

import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { TransactionsList } from './transactions-list'

export const TransactionHistoryPage: React.FC = () => {
  return (
    <ProtectedPage reqScope={Role.USER}  className='table-container'>
        <TransactionsList user={false} pending={[]} className='table'/>
    </ProtectedPage>
  )
}
