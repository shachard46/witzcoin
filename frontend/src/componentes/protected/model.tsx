import { ReactNode } from 'react'

export interface ProtectedPageParams {
  reqScope: string
  className?: string
  children: ReactNode
}
