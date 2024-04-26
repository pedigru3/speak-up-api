import { ClassDay } from '@/domain/enterprise/entities/class-day'

export abstract class ClassDayRepository {
  abstract create(classDay: ClassDay): Promise<void>
  abstract findById(id: string): Promise<ClassDay | null>
  abstract findMany(jorneyId: string): Promise<ClassDay[]>
}
