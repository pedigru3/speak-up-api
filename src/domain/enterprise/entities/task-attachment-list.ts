import { WatchedList } from '@/core/entities/watched-list'
import { TaskAttanchment } from './task-attachment'

export class TaskAttachmentList extends WatchedList<TaskAttanchment> {
  compareItems(a: TaskAttanchment, b: TaskAttanchment): boolean {
    return a.attachmentId === b.attachmentId
  }
}
