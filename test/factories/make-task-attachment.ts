import {
  TaskAttachment,
  TaskAttachmentProps,
} from '@/domain/gamefication/enterprise/entities/task-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeTaskAttachment(
  override: Partial<TaskAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const taskAttachment = TaskAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      taskId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
  return taskAttachment
}
