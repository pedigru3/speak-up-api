import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { PointCreatedEvent } from './events/point-created-event'

export interface PointProps {
  created_at: Date
  studentId: UniqueEntityID
  pointCategoryId: UniqueEntityID
  text: string
  icon: string
  value: number
}

export class Point extends AggregateRoot<PointProps> {
  get createdAt() {
    return this.props.created_at
  }

  get studentId() {
    return this.props.studentId
  }

  get pointCategoryId() {
    return this.props.pointCategoryId
  }

  get value() {
    return this.props.value
  }

  get text() {
    return this.props.text
  }

  get icon() {
    return this.props.icon
  }

  static create(
    props: Optional<PointProps, 'created_at'>,
    id?: UniqueEntityID,
  ) {
    const point = new Point(
      {
        created_at: props.created_at ?? new Date(),
        ...props,
      },
      id,
    )

    const isNewPoint = !id

    if (isNewPoint) {
      point.addDomainEvent(new PointCreatedEvent(point))
    }

    return point
  }
}
