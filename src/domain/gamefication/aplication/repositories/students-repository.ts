import { PaginationParams } from '@/core/repositories/pagination-params'
import { Student } from '@/domain/gamefication/enterprise/entities/student'
import { StudentRanking } from '@/domain/gamefication/enterprise/entities/student-ranking'

export abstract class StudentsRepository {
  abstract create(student: Student): Promise<void>
  abstract delete(studentId: string): Promise<void>
  abstract save(student: Student): Promise<void>
  abstract findById(id: string): Promise<Student | null>
  abstract findByEmail(email: string): Promise<Student | null>
  abstract findMany(params: PaginationParams): Promise<Student[]>
  abstract findManyByRanking(
    params: PaginationParams,
    date?: string,
  ): Promise<StudentRanking[]>
}
