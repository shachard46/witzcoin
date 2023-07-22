import { createContext, ReactNode, useContext } from 'react'
import { Params } from './models'
const ParamsContext = createContext<[Params, Function]>([{}, () => {}])

export const ParamsProvider: React.FC<{
  params: Params
  func: Function
  children: ReactNode
}> = ({ children, params, func }) => {
  return (
    <ParamsContext.Provider value={[params, func]}>
      {children}
    </ParamsContext.Provider>
  )
}

export const useParams = (): [Params, Function] => {
  return useContext(ParamsContext)
}
