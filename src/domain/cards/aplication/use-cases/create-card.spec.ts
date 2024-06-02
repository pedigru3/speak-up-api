import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateCardUseCase } from './create-card'
import { InMemoryCardsRepository } from 'test/repositories/in-memory-card-repository'

let inMemoryCardsRepository: InMemoryCardsRepository

describe('Create Card', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    inMemoryCardsRepository = new InMemoryCardsRepository()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shold be able create a card', async () => {
    vi.setSystemTime(new Date('2024-05-28T14:00:00'))
    const createCard = new CreateCardUseCase(inMemoryCardsRepository)

    const result = await createCard.execute({
      front: 'Hello',
      back: 'Olá',
      studentId: new UniqueEntityID('usuario'),
    })

    if (result.isLeft()) {
      return new Error('Não pode ser Left')
    }

    const card = await inMemoryCardsRepository.findById(
      result.value.id.toString(),
    )

    expect(card?.step).toBe(0)
    expect(card?.back).toBe('Olá')
    expect(card?.front).toBe('Hello')
    expect(card?.readAt).toBe(undefined)
    expect(card?.nextReadAt).toStrictEqual(new Date('2024-05-28T14:20:00'))
  })
})
