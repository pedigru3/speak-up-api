import { faker } from '@faker-js/faker'

import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/gamefication/enterprise/entities/answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const task = AnswerComment.create(
    {
      answerId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
  return task
}
