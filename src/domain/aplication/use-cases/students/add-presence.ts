import { Either, left, rigth } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { StudentsRepository } from '../../repositories/students-repository'
import { PresencesRepository } from '../../repositories/presences-repository'
import { Presence } from '@/domain/enterprise/entities/presence'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { AddPointUseCase } from '../points/add-points'
import dayjs from 'dayjs'

interface AddPresenceUseCaseRequest {
  date: string
  studentId: string
  categoryPointId?: string
}

type AddPresenceUseCaseResponse = Either<UseCaseError, object>

export class AddPresenceUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private presencesRepository: PresencesRepository,
    private addPointUseCase: AddPointUseCase,
  ) {}

  async execute({
    date,
    studentId,
    categoryPointId,
  }: AddPresenceUseCaseRequest): Promise<AddPresenceUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError())
    }

    if (student.id.toString() !== studentId) {
      return left(new NotAllowedError())
    }

    const lastPresence =
      await this.presencesRepository.getLastPresence(studentId)

    if (lastPresence) {
      const currentDate = dayjs().startOf('date')
      const presenceDate = dayjs(lastPresence.date).startOf('date')

      if (currentDate.diff(presenceDate) > 86400000) {
        student.daysInARow = 0
      }
    }

    const presence = Presence.create({
      date: new Date(date),
      studentId: new UniqueEntityID(studentId),
    })

    await this.presencesRepository.create(presence)

    if (categoryPointId) {
      await this.addPointUseCase.execute({ categoryPointId, studentId })
    }

    student.daysInARow += 1
    await this.studentsRepository.save(student)

    return rigth({})
  }
}
