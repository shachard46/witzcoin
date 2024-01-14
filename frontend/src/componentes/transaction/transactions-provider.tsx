import { useEffect, useState } from 'react'
import Provider from '../provider-model'
import { Transaction } from './models'
import { useApi } from '../api/api-provider'
import { useAuth } from '../auth/auth-provider'
import { TransactionsContext, refreshTransactions } from './transactions-hook'

export const TransactionsProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const { user, isAutonticated } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([])
  useEffect(() => {
    if (!isAutonticated || !user) return
    console.log(user)
    refreshTransactions(api, setTransactions, setUserTransactions, user)
  }, [user, isAutonticated])

  return (
    <TransactionsContext.Provider
      value={[
        [transactions, userTransactions],
        () =>
          refreshTransactions(api, setTransactions, setUserTransactions, user),
      ]}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
