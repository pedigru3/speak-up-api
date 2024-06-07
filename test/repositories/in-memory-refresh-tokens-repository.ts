import { RefreshTokenRepository } from '@/domain/gamefication/aplication/repositories/refresh-token-repository'
import { RefreshToken } from '@/domain/gamefication/enterprise/entities/refresh-token'

export class InMemoryRefreshTokensRepository implements RefreshTokenRepository {
  public items: RefreshToken[] = []

  async findById(id: string): Promise<RefreshToken | null> {
    const item = this.items.find((item) => item.id.toString() === id)
    return item ?? null
  }

  async createOrUpdate(refreshToken: RefreshToken): Promise<void> {
    const item = this.items.find(
      (value) => value.id.toString() === refreshToken.id.toString(),
    )
    if (item) {
      this.items = this.items.filter(
        (value) => value.id.toString() !== refreshToken.id.toString(),
      )
      this.items.push(
        RefreshToken.create({
          expiresIn: refreshToken.expiresIn,
          role: refreshToken.role,
          userId: refreshToken.userId,
        }),
      )
    } else {
      this.items.push(refreshToken)
    }
  }
}
