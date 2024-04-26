import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Task } from '@/domain/enterprise/entities/task'
import { Prisma, Task as PrismaTask } from '@prisma/client'

export class PrismaTaskMapper {
  static toDomain(raw: PrismaTask): Task {
    return Task.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        content: raw.content,
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(task: Task): Prisma.TaskUncheckedCreateInput {
    return {
      id: task.id.toString(),
      authorId: task.authorId.toString(),
      content: task.content,
      title: task.title,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }
  }
}
