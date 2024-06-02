import { Student } from '@/domain/gamefication/enterprise/entities/student'

export class StudentPresenter {
  static toHttp({ student }: { student: Student }) {
    return {
      name: student.name,
      email: student.email,
      avatar: student.avatar,
    }
  }
}
