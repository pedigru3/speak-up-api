import { faker } from '@faker-js/faker'

import { Task, TaskProps } from '@/domain/enterprise/entities/task'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaTaskMapper } from '@/infra/database/mappers/prisma-task-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeTask(
  override: Partial<TaskProps> = {},
  id?: UniqueEntityID,
) {
  const task = Task.create(
    {
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      ...override,
    },
    id,
  )
  return task
}

@Injectable()
export class TaskFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTask(data: Partial<TaskProps> = {}): Promise<Task> {
    const task = makeTask(data)

    await this.prisma.task.create({
      data: PrismaTaskMapper.toPrisma(task),
    })

    return task
  }
}
