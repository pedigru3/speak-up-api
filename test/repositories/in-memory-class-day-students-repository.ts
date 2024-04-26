import { ClassDayStudentsRepository } from '@/domain/aplication/repositories/class-day-students-repository'
import { ClassDayStudent } from '@/domain/enterprise/entities/class-day-student'

export class InMemoryClassDayStudentsRepository
  implements ClassDayStudentsRepository
{
  public items: ClassDayStudent[] = []

  async findManyByClassDayId(classDayId: string): Promise<ClassDayStudent[]> {
    const tasksAttachments = this.items.filter(
      (item) => item.toString() === classDayId,
    )

    return tasksAttachments
  }
}
