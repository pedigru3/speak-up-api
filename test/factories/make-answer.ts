import { faker } from '@faker-js/faker'

import {
  Answer,
  AnswerProps,
} from '@/domain/gamefication/enterprise/entities/answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerMapper } from '@/infra/database/mappers/prisma-answer-mapper'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const task = Answer.create(
    {
      studantId: new UniqueEntityID(),
      taskId: new UniqueEntityID(),
      url: faker.lorem.text(),
      ...override,
    },
    id,
  )
  return task
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })

    return answer
  }
}
