import { Point } from '@/domain/enterprise/entities/point'

export abstract class PointsRepository {
  abstract fetchLastPoints(userId: string): Promise<Point[]>
}
