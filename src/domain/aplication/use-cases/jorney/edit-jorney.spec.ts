import { makeJorney } from 'test/factories/make-jorney'
import { EditJorneyUseCase } from './edit-jorney'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryJorneyRepository } from 'test/repositories/in-memory-jorney-repository'
import { InMemoryJorneyDayRepository } from 'test/repositories/in-memory-jorney-day-repository'
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { makeJorneyDay } from 'test/factories/make-jorney-day'
import { NotAllowedError } from '../errors/not-allowed-error'
import { makeTeacher } from 'test/factories/make-teacher'

let inMemoryJorneysRepository: InMemoryJorneyRepository
let inMemoryTeachersRepository: InMemoryTeachersRepository
let inMemoryJorneyDayRepository: InMemoryJorneyDayRepository
let sut: EditJorneyUseCase

describe('Edit Jorney', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository()
    inMemoryJorneysRepository = new InMemoryJorneyRepository()
    inMemoryJorneyDayRepository = new InMemoryJorneyDayRepository()
    sut = new EditJorneyUseCase(
      inMemoryTeachersRepository,
      inMemoryJorneysRepository,
      inMemoryJorneyDayRepository,
    )
  })
  it('shold be able to edit a jorney', async () => {
    const teacher = makeTeacher({}, new UniqueEntityID('teacher-1'))
    const newJorney = makeJorney({}, new UniqueEntityID('jorney-1'))

    await inMemoryJorneysRepository.create(newJorney)
    await inMemoryTeachersRepository.create(teacher)

    inMemoryJorneyDayRepository.items.push(
      makeJorneyDay({
        jorneyId: newJorney.id,
        classDayId: new UniqueEntityID('1'),
      }),
      makeJorneyDay({
        jorneyId: newJorney.id,
        classDayId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      teacherId: 'teacher-1',
      jorneyId: 'jorney-1',
      classDaysIds: ['1', '2', '3'],
    })

    expect(inMemoryJorneysRepository.items[0].currentDay).toEqual(3)
    expect(
      inMemoryJorneysRepository.items[0].jorneyDays.currentItems,
    ).toHaveLength(3)
    expect(inMemoryJorneysRepository.items[0].jorneyDays.currentItems).toEqual([
      expect.objectContaining({ classDayId: new UniqueEntityID('1') }),
      expect.objectContaining({ classDayId: new UniqueEntityID('2') }),
      expect.objectContaining({ classDayId: new UniqueEntityID('3') }),
    ])
  })

  it('shold not be able to delete a jorney from another user', async () => {
    const newJorney = makeJorney({}, new UniqueEntityID('jorney-1'))

    await inMemoryJorneysRepository.create(newJorney)

    const result = await sut.execute({
      teacherId: 'author-1',
      jorneyId: 'jorney-1',
      classDaysIds: [],
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
