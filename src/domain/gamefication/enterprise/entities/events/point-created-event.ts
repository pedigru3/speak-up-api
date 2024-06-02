import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Point } from '../point'

export class PointCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public point: Point

  constructor(point: Point) {
    this.point = point
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.point.id
  }
}
