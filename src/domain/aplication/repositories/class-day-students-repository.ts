import { ClassDayStudent } from '@/domain/enterprise/entities/class-day-student'

export abstract class ClassDayStudentsRepository {
  abstract findManyByClassDayId(id: string): Promise<ClassDayStudent[]>
}
