import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AnswerProps {
  studantId: UniqueEntityID
  taskId: UniqueEntityID
  url: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Answer extends Entity<AnswerProps> {
  get authorId() {
    return this.props.studantId
  }

  get taskId() {
    return this.props.taskId
  }

  get url() {
    return this.props.url
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.createdAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set url(content: string) {
    this.props.url = content
    this.touch()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        url: props.url,
        studantId: props.studantId,
        taskId: props.taskId,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return answer
  }
}
