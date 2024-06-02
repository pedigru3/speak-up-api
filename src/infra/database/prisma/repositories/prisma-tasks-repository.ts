import { TasksRepository } from '@/domain/gamefication/aplication/repositories/tasks-repository'
import { Task } from '@/domain/gamefication/enterprise/entities/task'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaTaskMapper } from '../../mappers/prisma-task-mapper'

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private prisma: PrismaService) {}

  async create(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.create({
      data,
    })
  }

  async save(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    })

    if (!task) {
      return null
    }

    return PrismaTaskMapper.toDomain(task)
  }

  async delete(task: Task): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id: task.id.toString(),
      },
    })
  }
}
