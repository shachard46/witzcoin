import { createContext, useContext, useEffect, useState } from 'react'
import Provider from '../provider-model'
import { Transaction } from './models'
import { useApi } from '../api/api-provider'
import { useAuth } from '../auth/auth-provider'
const TransactionsContext = createContext<Transaction[][]>([])

export const TransactionsProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([])
  useEffect(() => {
    api
      .get<Transaction[]>('transactions')
      .then(res => setTransactions(res.data))
    api
      .get<Transaction[]>(`transactions/user/${user?.username}`)
      .then(res => setUserTransactions(res.data))
  }, [api])

  return (
    <TransactionsContext.Provider value={[transactions, userTransactions]}>
      {children}
    </TransactionsContext.Provider>
  )
}

export const useTransactions = (user: boolean = false) => {
  const transactions = useContext(TransactionsContext)
  if (user == true) return transactions[1]
  else return transactions[0]
}
