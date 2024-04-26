import { Student } from '@/domain/enterprise/entities/student'

export class StudentPresenter {
  static toHttp({ student }: { student: Student }) {
    return {
      name: student.name,
      email: student.email,
      avatar: student.avatar,
    }
  }
}
