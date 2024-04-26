import { Either, left, rigth } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { JorneyRepository } from '../../repositories/jorney-repository'
import { Jorney } from '@/domain/enterprise/entities/jorney'
import { JorneyDay } from '@/domain/enterprise/entities/jorney-day'
import { JorneyDayList } from '@/domain/enterprise/entities/jorney-day-list'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { JorneyDayRepository } from '../../repositories/jorney-day-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditJorneyUseCaseRequest {
  teacherId: string
  jorneyId: string
  classDaysIds: string[]
}

type EditJorneyUseCaseResponse = Either<NotAllowedError, Jorney>

@Injectable()
export class EditJorneyUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private jorneyRepository: JorneyRepository,
    private jorneyDayRepository: JorneyDayRepository,
  ) {}

  async execute({
    teacherId,
    jorneyId,
    classDaysIds,
  }: EditJorneyUseCaseRequest): Promise<EditJorneyUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const jorney = await this.jorneyRepository.findById(jorneyId)

    if (!jorney) {
      return left(new ResourceNotFoundError())
    }

    const currentClassDays = await this.jorneyDayRepository.findManyByTaskId(
      jorney.id.toString(),
    )

    const jorneyDayList = new JorneyDayList(currentClassDays)

    const jorneyDays = classDaysIds.map((classDayId) => {
      return JorneyDay.create({
        classDayId: new UniqueEntityID(classDayId),
        jorneyId: jorney.id,
      })
    })

    jorneyDayList.update(jorneyDays)

    console.log(JorneyDayList.length)

    jorney.jorneyDays = jorneyDayList

    return rigth(jorney)
  }
}
