import React, { useEffect, useState } from 'react'
import { useTransactions } from './transactions-hook'
import { Approver, Transaction, User } from './models'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { useAuth } from '../auth/auth-hook'
import { TransactionsList } from './transactions-list'
import { Typography } from '@mui/material'

const isYourPendingTransactions = (user: User | null, t: Transaction) => {
  let role = Approver.NON
  if (t.buyerUser == user?.username) role = Approver.BUYER
  else if (t.sellerUser == user?.username) role = Approver.SELLER
  else if (t.witnessUser == user?.username) role = Approver.WITNESS
  else return false

  if (t.status == Approver.ALL) return true
  if (role == Approver.WITNESS) return true
  if (t.status == Approver.NON) return false
  if (role == Approver.BUYER && t.status % 2 != 0) return true
  if (
    role == Approver.SELLER &&
    (t.status % 3 == 0 || t.status == Approver.SELLER)
  )
    return true
  return false
}

export const PendingTransactions: React.FC = () => {
  const [transactions, refreshTransactions] = useTransactions(true)
  const { user } = useAuth()
  const [pendingTransactionsList] = useState<Transaction[]>(
    transactions.filter(t => isYourPendingTransactions(user, t)),
  )

  useEffect(() => refreshTransactions(), [])
  return (
    <ProtectedPage reqScope={Role.USER} className='mt-auto flex justify-center px-4 py-6 sm:px-6'>
      {pendingTransactionsList.length > 0 ? (
        <TransactionsList user={true} pending={pendingTransactionsList} className='w-full max-w-5xl min-w-0' />
      ) : (
        <Typography
          variant='body1'
          align='center'
          sx={{ px: 2, py: 4, color: 'text.secondary', maxWidth: 480 }}
        >
          אין עסקאות ממתינות כרגע.
        </Typography>
      )}
    </ProtectedPage>
  )
}
