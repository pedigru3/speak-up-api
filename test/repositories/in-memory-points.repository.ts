import { DomainEvents } from '@/core/events/domain-events'
import { PointsRepository } from '@/domain/gamefication/aplication/repositories/points-repository'
import { Point } from '@/domain/gamefication/enterprise/entities/point'

export class InMemoryPointsRepository implements PointsRepository {
  items: Point[] = []

  async create(point: Point): Promise<void> {
    this.items.push(point)
    console.log(`tchau ${point.id.toString()}`)

    DomainEvents.dispatchEventsForAggregate(point.id)
  }

  async findById(id: string): Promise<Point | null> {
    const item = this.items.find((item) => item.id.toString() === id)
    return item ?? null
  }

  async fetchLastPoints(userId: string): Promise<Point[]> {
    const reverseItems = this.items.slice().reverse()
    const item = reverseItems.filter(
      (item) => item.studentId.toString() === userId,
    )
    return item ?? null
  }
}
