import { makeUser } from 'test/factories/make-user'
import { GetUserByIdUseCase } from './get-user-by-id'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let sub: GetUserByIdUseCase

describe('Get User By Id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sub = new GetUserByIdUseCase(inMemoryUsersRepository)
  })
  it('shold be able to get user by id', async () => {
    const user = makeUser({
      name: 'João',
    })

    await inMemoryUsersRepository.create(user)

    const result = await sub.execute({
      requesterId: user.id.toString(),
      targetUserId: user.id.toString(),
    })

    if (result.isLeft()) {
      throw new Error()
    }

    expect(result.value?.name).toEqual('João')
  })

  it('shold be able to get other user', async () => {
    const user = makeUser({
      name: 'João',
      role: 'ADMIN',
    })

    const otherUser = makeUser({
      name: 'Jonh Doe',
    })

    await inMemoryUsersRepository.create(user)
    await inMemoryUsersRepository.create(otherUser)

    const result = await sub.execute({
      requesterId: user.id.toString(),
      targetUserId: otherUser.id.toString(),
    })

    if (result.isLeft()) {
      throw new Error()
    }

    expect(result.value?.name).toEqual('Jonh Doe')
  })

  it('shold be not able to get other user', async () => {
    const user = makeUser({
      name: 'João',
      role: 'USER',
    })

    const otherUser = makeUser({
      name: 'Jonh Doe',
    })

    await inMemoryUsersRepository.create(user)
    await inMemoryUsersRepository.create(otherUser)

    const result = await sub.execute({
      requesterId: user.id.toString(),
      targetUserId: otherUser.id.toString(),
    })

    expect(result.isLeft).toBeTruthy()
  })
})
