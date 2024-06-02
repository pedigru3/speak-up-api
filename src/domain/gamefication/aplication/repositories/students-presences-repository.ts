import { StudentPresence } from '@/domain/gamefication/enterprise/entities/student-presence'

export abstract class StudentsPresencesRepository {
  abstract findManyByClassDayId(id: string): Promise<StudentPresence[]>
  abstract getAll(): Promise<StudentPresence[]>
}
