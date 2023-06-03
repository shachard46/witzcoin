import Provider from '../provider-model'
import { useToken } from './token-provider'

const AuthProvider: React.FC<Provider> = ({ children }) => {
  const token = useToken()
}
