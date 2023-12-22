import { SetMetadata } from '@nestjs/common'

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
export const IS_PUBLIC_KEY = 'isPublic'
export const ROLES = 'roles'
export const Roles = (roles: Role[]) => SetMetadata(ROLES, roles)
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
