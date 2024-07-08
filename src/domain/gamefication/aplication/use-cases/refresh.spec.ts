import { RefreshUseCase } from './refresh'
import { InMemoryRefreshTokensRepository } from 'test/repositories/in-memory-refresh-tokens-repository'
import { FakeEncrypter } from 'test/cryptograph/fakeEncrypter'
import { makeRefreshToken } from 'test/factories/make-refresh-token'

let fakeEncrypter: FakeEncrypter
let inMemoryRefreshTokensRepository: InMemoryRefreshTokensRepository
let sub: RefreshUseCase

describe('Refresh Token', () => {
  beforeEach(() => {
    inMemoryRefreshTokensRepository = new InMemoryRefreshTokensRepository()
    fakeEncrypter = new FakeEncrypter()
    sub = new RefreshUseCase(inMemoryRefreshTokensRepository, fakeEncrypter)
  })
  it('shold be get a new access_token and refresh token', async () => {
    const refreshTokenCreated = makeRefreshToken({})

    inMemoryRefreshTokensRepository.createOrUpdate(refreshTokenCreated)

    const response = await sub.execute({
      refreshTokenId: refreshTokenCreated.id.toString(),
    })

    expect(response.isright()).toBeTruthy()
    expect(response.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })

    const oldRefreshToken = await inMemoryRefreshTokensRepository.findById(
      refreshTokenCreated.id.toString(),
    )

    expect(oldRefreshToken).toBeNull()
  })
})
