import { ReactNode } from 'react'

export interface ProtectedPageParams {
  level: number
  className?: string
  children: ReactNode
}
