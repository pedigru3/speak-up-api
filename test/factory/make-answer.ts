import { faker } from '@faker-js/faker'

import { Answer, AnswerProps } from '@/domain/enterprise/entities/answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const task = Answer.create(
    {
      studantId: new UniqueEntityID(),
      taskId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
  return task
}
