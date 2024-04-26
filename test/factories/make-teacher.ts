import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Teacher, TeacherProps } from '@/domain/enterprise/entities/teacher'

export function makeTeacher(
  override: Partial<TeacherProps> = {},
  id?: UniqueEntityID,
) {
  const teacher = Teacher.create(
    {
      name: faker.lorem.word(),
      ...override,
    },
    id,
  )
  return teacher
}
