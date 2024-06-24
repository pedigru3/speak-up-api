import { StudentRanking } from '@/domain/gamefication/enterprise/entities/student-ranking'

export class StudentRankingPresenter {
  static toHttp(studentRanking: StudentRanking) {
    return {
      id: studentRanking.id.toString(),
      avatar: studentRanking.avatar,
      name: studentRanking.name,
      level: studentRanking.level,
      points: studentRanking.points,
      days_in_a_row: studentRanking.daysInARow,
    }
  }
}
