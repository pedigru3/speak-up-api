import { WatchedList } from '@/core/entities/watched-list'
import { TaskAttachment } from './task-attachment'

export class TaskAttachmentList extends WatchedList<TaskAttachment> {
  compareItems(a: TaskAttachment, b: TaskAttachment): boolean {
    return a.attachmentId === b.attachmentId
  }
}
