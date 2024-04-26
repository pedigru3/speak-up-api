import { Point } from '@/domain/enterprise/entities/point'
import { Student } from '@/domain/enterprise/entities/student'

export class InfoPresenter {
  static toHttp({
    student,
    lastPoints,
  }: {
    student: Student
    lastPoints: Point[]
  }) {
    return {
      name: student.name,
      email: student.email,
      avatar: student.avatar,
      days_in_a_row: student.daysInARow,
      pending_tasks: student.pendingTasks,
      level: student.level,
      points: student.points,
      last_points: lastPoints.map((point) => {
        return { text: point.text, value: point.value }
      }),
    }
  }
}
