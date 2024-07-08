import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeJorney } from 'test/factories/make-jorney'
import { InMemoryJorneyRepository } from 'test/repositories/in-memory-jorney-repository'
import { EditJourneyUseCase } from './edit-journey'

let inMemoryJourneysRepository: InMemoryJorneyRepository

let sut: EditJourneyUseCase

describe('Edit Journey', () => {
  beforeEach(async () => {
    inMemoryJourneysRepository = new InMemoryJorneyRepository()

    sut = new EditJourneyUseCase(inMemoryJourneysRepository)
  })
  it('shold be able to edit a Journey', async () => {
    inMemoryJourneysRepository.items.push(
      makeJorney({}, new UniqueEntityID('1')),
    )

    await sut.execute({
      id: '1',
      title: 'New title',
      description: 'New description',
    })

    const journey = await inMemoryJourneysRepository.findById('1')

    expect(journey?.title).toBe('New title')
    expect(journey?.description).toBe('New description')
  })
})
