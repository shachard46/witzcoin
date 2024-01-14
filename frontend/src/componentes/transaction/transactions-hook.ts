import { AxiosInstance } from "axios"
import { Transaction, User } from "./models"
import { createContext, useContext } from "react"
export const TransactionsContext = createContext<[Transaction[][], () => void]>([
  [],
  () => {},
])

export const refreshTransactions = (
  api: AxiosInstance,
  setTransactions: (t: Transaction[]) => void,
  setUserTransactions: (t: Transaction[]) => void,
  user: User | null,
) => {
  api.get<Transaction[]>('transactions').then(res => setTransactions(res.data))
  api
    .get<Transaction[]>(`transactions/user/${user?.username}`)
    .then(res => setUserTransactions(res.data))
}

export const useTransactions = (
  user: boolean = false,
): [Transaction[], () => void] => {
  const [transactions, refreshTransactions] = useContext(TransactionsContext)
  if (user == true) return [transactions[1], refreshTransactions]
  else return [transactions[0], refreshTransactions]
}
