import { createContext, useContext, useEffect, useState } from 'react'
import Provider from '../provider-model'
import { Transaction } from './models'
import { useApi } from '../api/api-provider'
const TransactionsContext = createContext<Transaction[]>([])

export const TransactionsProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
    const [transactions, setTrasactions] = useState<Transaction[]>([])
  useEffect(() => {
    api.get('transactions').then((res)=>setTrasactions(res.data))
  }, [api])

  return (
    <TransactionsContext.Provider
      value={transactions}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export const useTransactions = () => {
  return useContext(TransactionsContext)
}
