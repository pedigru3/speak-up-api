import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AnswerAttanchmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttanchment extends Entity<AnswerAttanchmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttanchmentProps, id?: UniqueEntityID) {
    const answerAttanchment = new AnswerAttanchment(props, id)
    return answerAttanchment
  }
}
