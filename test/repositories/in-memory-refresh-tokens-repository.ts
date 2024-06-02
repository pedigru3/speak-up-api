import { RefreshTokenRepository } from '@/domain/gamefication/aplication/repositories/refresh-token-repository'
import { RefreshToken } from '@/domain/gamefication/enterprise/entities/refresh-token'

export class InMemoryRefreshTokensRepository implements RefreshTokenRepository {
  public items: RefreshToken[] = []

  async findById(id: string): Promise<RefreshToken | null> {
    const item = this.items.find((item) => item.id.toString() === id)
    return item ?? null
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    this.items.push(refreshToken)
  }
}
