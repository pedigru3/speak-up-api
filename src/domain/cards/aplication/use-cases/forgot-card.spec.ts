import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateCardUseCase } from './create-card'
import { InMemoryCardsRepository } from 'test/repositories/in-memory-card-repository'
import { ForgotCardUseCase } from './forgot-card'

let inMemoryCardsRepository: InMemoryCardsRepository

describe('Forgot card', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    inMemoryCardsRepository = new InMemoryCardsRepository()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shold be able forgot a card', async () => {
    vi.setSystemTime(new Date('2024-05-28T14:00:00'))
    const createCard = new CreateCardUseCase(inMemoryCardsRepository)

    const result = await createCard.execute({
      front: 'Hello',
      back: 'Olá',
      studentId: new UniqueEntityID('usuario'),
    })

    if (result.isLeft()) {
      return expect(result.isLeft()).toBeFalsy()
    }

    vi.setSystemTime(new Date('2024-06-28T14:00:00'))

    // forgot
    const forgotCard = new ForgotCardUseCase(inMemoryCardsRepository)
    await forgotCard.execute({ id: result.value.id })

    const card = await inMemoryCardsRepository.findById(
      result.value.id.toString(),
    )

    expect(card?.nextReadAt).toStrictEqual(new Date('2024-06-28T14:20:00'))
    expect(card?.step).toBe(0)
  })
})
