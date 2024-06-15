import { AxiosInstance } from 'axios'
import { Transaction, User } from './models'
import { createContext, useContext, useCallback } from 'react'

// Creating the context for transactions
export const TransactionsContext = createContext<[Transaction[][], () => void]>(
  [[], () => {}],
)

// Function to refresh transactions from the API
export const refreshTransactions = (
  api: AxiosInstance,
  setTransactions: (transactions: Transaction[]) => void,
  setUserTransactions: (transactions: Transaction[]) => void,
  user: User | null,
) => {
  api
    .get<Transaction[]>('transactions')
    .then(res => setTransactions(res.data))
    .catch(err => console.error('Error fetching all transactions:', err))

  if (user) {
    api
      .get<Transaction[]>(`transactions/user/${user.username}`)
      .then(res => setUserTransactions(res.data))
      .catch(err => console.error('Error fetching user transactions:', err))
  }
}

// Custom hook to use transactions from the context
export const useTransactions = (
  user: boolean = false,
): [Transaction[], () => void] => {
  const [transactions, refreshTransactions] = useContext(TransactionsContext)

  const refresh = useCallback(() => {
    refreshTransactions()
  }, [refreshTransactions])

  return user
    ? [transactions[1] || [], refresh]
    : [transactions[0] || [], refresh]
}
