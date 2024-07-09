import { Teacher } from '@/domain/gamefication/enterprise/entities/teacher'

export abstract class TeachersRepository {
  abstract create(teacher: Teacher): Promise<void>
  abstract findById(id: string): Promise<Teacher | null>
  abstract findByEmail(email: string): Promise<Teacher | null>
}
