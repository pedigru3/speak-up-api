import { Teacher } from '@/domain/enterprise/entities/teacher'

export abstract class TeachersRepository {
  // abstract create(teacher: Teacher): Promise<void>
  // abstract save(teacher: Teacher): Promise<void>
  abstract findById(id: string): Promise<Teacher | null>
}
