import { Point } from '@/domain/gamefication/enterprise/entities/point'

export abstract class PointsRepository {
  abstract create(point: Point): Promise<void>
  abstract findById(id: string): Promise<Point | null>
  abstract fetchLastPoints(userId: string): Promise<Point[]>
}
