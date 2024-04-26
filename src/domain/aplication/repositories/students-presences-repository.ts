import { StudentPresence } from '@/domain/enterprise/entities/student-presence'

export abstract class StudentsPresencesRepository {
  abstract findManyByClassDayId(id: string): Promise<StudentPresence[]>
  abstract getAll(): Promise<StudentPresence[]>
}
