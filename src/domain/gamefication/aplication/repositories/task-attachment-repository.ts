import { TaskAttachment } from '@/domain/gamefication/enterprise/entities/task-attachment'

export abstract class TaskAttachmentRepository {
  abstract findManyByTaskId(taskId: string): Promise<TaskAttachment[]>
}
