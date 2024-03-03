import { TaskAttachmentRepository } from '@/domain/aplication/repositories/task-attachment-repository'
import { TaskAttachment } from '@/domain/enterprise/entities/task-attachment'

export class InMemoryTaskAttachmentRepository
  implements TaskAttachmentRepository
{
  public items: TaskAttachment[] = []

  async findManyByTaskId(taskId: string): Promise<TaskAttachment[]> {
    const tasksAttachments = this.items.filter(
      (item) => item.taskId.toString() === taskId,
    )

    return tasksAttachments
  }
}
