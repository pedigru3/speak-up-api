import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface PointProps {
  created_at: Date
  studentId: UniqueEntityID
  pointCategoryId: UniqueEntityID
  text: string
  icon: string | null
  value: number
}

export class Point extends Entity<PointProps> {
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

  static create(props: Optional<PointProps, 'icon'>, id?: UniqueEntityID) {
    const point = new Point({ icon: props.icon ?? null, ...props }, id)

    return point
  }
}
