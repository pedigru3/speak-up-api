import { faker } from '@faker-js/faker'

import { Task, TaskProps } from '@/domain/enterprise/entities/task'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeTask(
  override: Partial<TaskProps> = {},
  id?: UniqueEntityID,
) {
  const task = Task.create(
    {
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      ...override,
    },
    id,
  )
  return task
}
