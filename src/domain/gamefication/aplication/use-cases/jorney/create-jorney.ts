import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { JourneysRepository } from '../../repositories/jorney-repository'
import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'

interface CreateJorneyUseCaseRequest {
  title: string
  description: string
  teacherId: string
  maxDay: number
}

type CreateJorneyUseCaseResponse = Either<NotAllowedError, Journey>

@Injectable()
export class CreateJourneyUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private jorneyRepository: JourneysRepository,
  ) {}

  async execute({
    teacherId,
    maxDay,
    description,
    title,
  }: CreateJorneyUseCaseRequest): Promise<CreateJorneyUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const jorney = Journey.create({
      title,
      description,
      maxDay,
    })

    await this.jorneyRepository.create(jorney)

    return right(jorney)
  }
}
