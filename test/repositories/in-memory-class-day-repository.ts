import { ClassDayRepository } from '@/domain/gamefication/aplication/repositories/class-day-repository'
import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'

export class InMemoryClassDayRepository implements ClassDayRepository {
  public items: ClassDay[] = []

  async create(item: ClassDay): Promise<void> {
    this.items.push(item)
  }

  async findById(id: string): Promise<ClassDay | null> {
    const item = this.items.find((item) => item.id.toValue() === id)
    return item ?? null
  }

  async findMany(jorneyId: string): Promise<ClassDay[]> {
    const item = this.items.filter(
      (item) => item.jorneyId.toString() === jorneyId.toString(),
    )
    return item
  }

  async getLastByStudentId(studentId: string): Promise<ClassDay | null> {
    const reverseItems = this.items.slice().reverse()
    const item = reverseItems.find((item) =>
      item.attendanceList.currentItems.find(
        (item) => item.studentId.toString() === studentId,
      ),
    )
    return item ?? null
  }
}
