import { ClassDayStudentsRepository } from '@/domain/gamefication/aplication/repositories/class-day-students-repository'
import { ClassDayStudent } from '@/domain/gamefication/enterprise/entities/class-day-student'

export class InMemoryClassDayStudentsRepository
  implements ClassDayStudentsRepository
{
  public items: ClassDayStudent[] = []

  async create(item: ClassDayStudent): Promise<void> {
    this.items.push(item)
  }

  async findManyByClassDayId(classDayId: string): Promise<ClassDayStudent[]> {
    const tasksAttachments = this.items.filter(
      (item) => item.classDayId.toString() === classDayId,
    )

    return tasksAttachments
  }
}
