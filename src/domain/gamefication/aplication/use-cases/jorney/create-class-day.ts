import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'
import { ClassDayRepository } from '../../repositories/class-day-repository'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { JourneysRepository } from '../../repositories/jorney-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UseCaseError } from '@/core/errors/use-cases-error'
import { NotAllowedCreateClassError } from './errors/not-allowed-create-class-error'

interface CreateClassDayUseCaseRequest {
  teacherId: string
  jorneyId: string
}

type CreateClassDayUseCaseResponse = Either<UseCaseError, ClassDay>

@Injectable()
export class CreateClassDayUseCase {
  constructor(
    private classDayRepository: ClassDayRepository,
    private teachersRepository: TeachersRepository,
    private jorneyRepository: JourneysRepository,
  ) {}

  async execute({
    teacherId,
    jorneyId,
  }: CreateClassDayUseCaseRequest): Promise<CreateClassDayUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const jorney = await this.jorneyRepository.findById(jorneyId)

    if (!jorney) {
      return left(new ResourceNotFoundError())
    }

    if (jorney.currentDay + 1 > jorney.maxDay) {
      return left(new NotAllowedCreateClassError())
    }

    const classDay = ClassDay.create({
      jorneyId: jorney.id,
      maxDay: jorney.maxDay,
      currentDay: jorney.currentDay + 1,
      date: new Date(),
    })

    jorney.newClassDay(classDay)

    await this.classDayRepository.create(classDay)

    return right(classDay)
  }
}
