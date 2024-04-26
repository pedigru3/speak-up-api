import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CategoryPointProps {
  text: string
  value: number
  icon: string
}

export class CategoryPoint extends Entity<CategoryPointProps> {
  get text() {
    return this.props.text
  }

  get value() {
    return this.props.value
  }

  get icon() {
    return this.props.icon
  }

  static create(props: CategoryPointProps, id?: UniqueEntityID) {
    const categoryPoint = new CategoryPoint(props, id)

    return categoryPoint
  }
}
