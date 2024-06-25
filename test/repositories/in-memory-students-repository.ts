import { PaginationParams } from '@/core/repositories/pagination-params'
import { StudentsRepository } from '@/domain/gamefication/aplication/repositories/students-repository'
import { Student } from '@/domain/gamefication/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findById(id: string): Promise<Student | null> {
    const item = this.items.find((item) => item.id.toString() === id)
    return item ?? null
  }

  async findByEmail(email: string): Promise<Student | null> {
    const item = this.items.find((item) => item.email === email)
    return item ?? null
  }

  async save(student: Student): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === student.id)
    this.items[itemIndex] = student
  }

  async create(student: Student): Promise<void> {
    this.items.push(student)
  }

  async findManyByRanking({ page }: PaginationParams): Promise<Student[]> {
    // Ordenar a lista de alunos com base nas pontuações (maior para menor)

    const students = this.items
      .sort((a, b) => b.points - a.points)
      .slice((page - 1) * 20, page * 20)

    // Retornar a lista ordenada
    return students
  }

  async findMany(params: PaginationParams): Promise<Student[]> {
    const item = this.items.slice((params.page - 1) * 20, params.page * 20)
    return item
  }

  async delete(studentId: string): Promise<void> {
    const items = this.items.filter((item) => item.id.toString() !== studentId)
    this.items = items
  }
}
