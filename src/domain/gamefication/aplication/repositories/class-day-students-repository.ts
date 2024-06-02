import { ClassDayStudent } from '@/domain/gamefication/enterprise/entities/class-day-student'

export abstract class ClassDayStudentsRepository {
  abstract create(classDayStudent: ClassDayStudent): Promise<void>
  abstract findManyByClassDayId(id: string): Promise<ClassDayStudent[]>
}
