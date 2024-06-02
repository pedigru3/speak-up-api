import { AuthenticateUserUseCase } from './authenticate-user'
import { FakeEncrypter } from 'test/cryptograph/fakeEncrypter'
import { FakeHasher } from 'test/cryptograph/fakeHasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRefreshTokensRepository } from 'test/repositories/in-memory-refresh-tokens-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRefreshTokensRepository: InMemoryRefreshTokensRepository

let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRefreshTokensRepository = new InMemoryRefreshTokensRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      inMemoryRefreshTokensRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      email: 'user@example.com',
      password: await fakeHasher.hash('1'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      email: 'user@example.com',
      password: '1',
    })

    expect(result.isright()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      user: {
        name: expect.any(String),
        email: expect.any(String),
      },
    })
  })
})
