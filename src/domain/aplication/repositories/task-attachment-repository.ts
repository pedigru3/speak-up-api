import { TaskAttachment } from '@/domain/enterprise/entities/task-attachment'

export abstract class TaskAttachmentRepository {
  abstract findManyByTaskId(taskId: string): Promise<TaskAttachment[]>
}
