import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/gamefication/aplication/repositories/answers-repository'
import { Answer } from '@/domain/gamefication/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../../mappers/prisma-answer-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.delete({
      where: {
        id: data.id,
      },
    })
  }
}
