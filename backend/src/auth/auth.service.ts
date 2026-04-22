import { AuthUserDto } from '../user/user.interface'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { jwtConstants } from '../backend-constants'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(user: AuthUserDto): Promise<{
    access_token: string
    refresh_token: string
    profileIncomplete: boolean
  }> {
    if (!user?.email || !user?.password) throw new UnauthorizedException()
    const existingUser = await this.userService.findUserForLogin(
      user.email,
      user.password,
    )
    if (!existingUser) throw new UnauthorizedException()
    const profileIncomplete = isProfileIncomplete(existingUser)
    const tokens = await this.issueTokenPair(
      existingUser.username,
      existingUser.role,
    )
    return { ...tokens, profileIncomplete }
  }

  async refresh(refreshToken: string): Promise<{ access_token: string }> {
    if (!refreshToken) throw new UnauthorizedException()
    try {
      const payload = await this.jwtService.verifyAsync<{
        tokenType: string
        sub: string
      }>(refreshToken, { secret: jwtConstants.refreshSecret })
      if (payload.tokenType !== 'refresh' || !payload.sub) {
        throw new UnauthorizedException()
      }
      const existingUser = await this.userService.getUserByUsername(payload.sub)
      if (!existingUser) throw new UnauthorizedException()
      const tokens = await this.issueTokenPair(payload.sub, existingUser.role)
      return { access_token: tokens.access_token }
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  private async issueTokenPair(
    username: string,
    role: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessPayload = {
      tokenType: 'access',
      access_token: {
        username,
        sub: { username, role },
      },
    }
    const refreshPayload = {
      tokenType: 'refresh',
      sub: username,
    }
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(accessPayload, { expiresIn: '15m' }),
      this.jwtService.signAsync(refreshPayload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
      }),
    ])
    return { access_token, refresh_token }
  }
}

function isProfileIncomplete(user: {
  email: string | null
  fullName: string | null
}): boolean {
  const e = user.email?.trim()
  const n = user.fullName?.trim()
  return !e || !n
}

export function isCurrentUser(username: string, request) {
  const sub = request.user?.access_token?.sub
  const expected =
    typeof sub === 'object' && sub && 'username' in sub
      ? (sub as { username: string }).username
      : sub
  if (username !== expected) {
    throw new UnauthorizedException('Not your god damn user')
  }
}
