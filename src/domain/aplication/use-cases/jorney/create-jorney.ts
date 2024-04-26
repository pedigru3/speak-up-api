import { Either, left, rigth } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { JorneyRepository } from '../../repositories/jorney-repository'
import { Jorney } from '@/domain/enterprise/entities/jorney'
import { ClassDayRepository } from '../../repositories/class-day-repository'
import { JorneyDay } from '@/domain/enterprise/entities/jorney-day'
import { JorneyDayList } from '@/domain/enterprise/entities/jorney-day-list'

interface CreateJorneyUseCaseRequest {
  teacherId: string
  maxDay: number
}

type CreateJorneyUseCaseResponse = Either<NotAllowedError, Jorney>

@Injectable()
export class CreateJorneyUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private jorneyRepository: JorneyRepository,
    private classDayRepository: ClassDayRepository,
  ) {}

  async execute({
    teacherId,
    maxDay,
  }: CreateJorneyUseCaseRequest): Promise<CreateJorneyUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) {
      return left(new NotAllowedError())
    }

    const jorney = Jorney.create({
      maxDay,
    })

    const classDays = await this.classDayRepository.findMany(
      jorney.id.toString(),
    )

    const jorneyDays = classDays.map((classDay) => {
      return JorneyDay.create({
        classDayId: classDay.id,
        jorneyId: classDay.jorneyId,
      })
    })

    jorney.jorneyDays = new JorneyDayList(jorneyDays)

    await this.jorneyRepository.create(jorney)

    return rigth(jorney)
  }
}
