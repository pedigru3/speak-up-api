import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudentRanking } from '@/domain/enterprise/entities/student-ranking'

export type PrismaStudentRanking = {
  id: string
  name: string
  avatar: string
  daysInARow: number
  total_points: number
}

export class PrismaStudentRankingMapper {
  static toDomain(raw: PrismaStudentRanking): StudentRanking {
    return StudentRanking.create(
      {
        name: raw.name,
        avatar: raw.avatar,
        daysInARow: raw.daysInARow,
        points: Number(raw.total_points),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
