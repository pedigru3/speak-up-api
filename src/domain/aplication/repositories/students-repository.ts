import { PaginationParams } from '@/core/repositories/pagination-params'
import { Student } from '@/domain/enterprise/entities/student'
import { StudentRanking } from '@/domain/enterprise/entities/student-ranking'

export abstract class StudentsRepository {
  abstract create(student: Student): Promise<void>
  abstract save(student: Student): Promise<void>
  abstract findById(id: string): Promise<Student | null>
  abstract findByEmail(email: string): Promise<Student | null>
  abstract findManyByRanking(
    params: PaginationParams,
    date?: string,
  ): Promise<StudentRanking[]>
}
