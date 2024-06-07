import { RefreshToken } from '../../enterprise/entities/refresh-token'

export abstract class RefreshTokenRepository {
  abstract findById(id: string): Promise<RefreshToken | null>
  abstract createOrUpdate(refreshToken: RefreshToken): Promise<void>
}
