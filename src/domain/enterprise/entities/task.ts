import dayjs from 'dayjs'
import { Optional } from '../../../core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { TaskAttachmentList } from './task-attachment-list'

export interface TaskProps {
  authorId: UniqueEntityID
  attachments: TaskAttachmentList
  title: string
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Task extends AggregateRoot<TaskProps> {
  get authorId() {
    return this.props.authorId
  }

  get attachments() {
    return this.props.attachments
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew() {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: TaskAttachmentList) {
    this.props.attachments = attachments
  }

  static create(
    props: Optional<TaskProps, 'createdAt' | 'updatedAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const task = new Task(
      {
        ...props,
        attachments: props.attachments ?? new TaskAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return task
  }
}
