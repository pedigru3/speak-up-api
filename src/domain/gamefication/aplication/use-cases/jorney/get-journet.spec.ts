import { InMemoryJorneyRepository } from 'test/repositories/in-memory-jorney-repository'
import { GetJourneyByIdUseCase } from './get-journey'
import { makeJorney } from 'test/factories/make-jorney'

describe('GetJourneyByIdUseCase', () => {
  let getJourneyByIdUseCase: GetJourneyByIdUseCase
  let inMemoryJorneyRepository: InMemoryJorneyRepository

  beforeEach(() => {
    inMemoryJorneyRepository = new InMemoryJorneyRepository()
    getJourneyByIdUseCase = new GetJourneyByIdUseCase(inMemoryJorneyRepository)
  })

  it('should be able to get a journey by id', async () => {
    const journey = makeJorney()

    await inMemoryJorneyRepository.create(journey)

    const result = await getJourneyByIdUseCase.execute({
      id: journey.id.toString(),
    })

    expect(result.value).toEqual(journey)
  })
})
