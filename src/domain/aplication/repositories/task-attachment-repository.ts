import { TaskAttachment } from '@/domain/enterprise/entities/task-attachment'

export interface TaskAttachmentRepository {
  findManyByTaskId(taskId: string): Promise<TaskAttachment[]>
}
