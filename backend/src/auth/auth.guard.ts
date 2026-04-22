import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from '../backend-constants'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY, ROLES, Role } from './auth.interfaces'
import { AuthGuard as NestAuthGuard } from '@nestjs/passport'

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('No token provided')
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        tokenType?: string
        access_token?: unknown
      }>(token, {
        secret: jwtConstants.secret,
      })

      const isAccess =
        payload.tokenType === 'access' ||
        (!payload.tokenType && !!payload.access_token)
      if (!isAccess || !payload.access_token) {
        throw new UnauthorizedException('Invalid token type')
      }

      request.user = payload
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err
      throw new UnauthorizedException('Invalid token')
    }

    return true
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized')
    }

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [Role.USER]

    const userRole = user?.access_token?.sub?.role
    if (!roles.includes(userRole) && userRole !== Role.ADMIN) {
      throw new UnauthorizedException('Insufficient role')
    }

    return user
  }
}

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}
