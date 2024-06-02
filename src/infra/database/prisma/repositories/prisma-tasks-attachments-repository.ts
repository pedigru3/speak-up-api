import { TaskAttachmentRepository } from '@/domain/gamefication/aplication/repositories/task-attachment-repository'
import { TaskAttachment } from '@/domain/gamefication/enterprise/entities/task-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaTasksAttachmentsRepository
  implements TaskAttachmentRepository
{
  findManyByTaskId(taskId: string): Promise<TaskAttachment[]> {
    throw new Error('Method not implemented.')
  }
}
