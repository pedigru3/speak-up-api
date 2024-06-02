import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateCardUseCase } from './create-card'
import { InMemoryCardsRepository } from 'test/repositories/in-memory-card-repository'
import { RememberCardUseCase } from './remember-card'

let inMemoryCardsRepository: InMemoryCardsRepository

describe('Remember card', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    inMemoryCardsRepository = new InMemoryCardsRepository()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shold be able remember a card', async () => {
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

    vi.setSystemTime(new Date('2024-06-01T14:00:00'))

    // remember day 1
    const rememberCard = new RememberCardUseCase(inMemoryCardsRepository)
    await rememberCard.execute({ id: result.value.id })

    const card = await inMemoryCardsRepository.findById(
      result.value.id.toString(),
    )

    expect(card?.nextReadAt).toStrictEqual(new Date('2024-06-02T14:00:00'))
    expect(card?.step).toBe(1)

    vi.setSystemTime(new Date('2024-06-02T14:00:00'))

    // remember day 2
    await rememberCard.execute({ id: result.value.id })

    expect(card?.nextReadAt).toStrictEqual(new Date('2024-06-04T14:00:00'))
    expect(card?.step).toBe(2)
  })
})
