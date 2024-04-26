import { StudentRanking } from '@/domain/enterprise/entities/student-ranking'

export class StudentRankingPresenter {
  static toHttp(studentRanking: StudentRanking) {
    return {
      id: studentRanking.id,
      name: studentRanking.name,
      level: studentRanking.level,
      points: studentRanking.points,
      days_in_a_row: studentRanking.daysInARow,
    }
  }
}
