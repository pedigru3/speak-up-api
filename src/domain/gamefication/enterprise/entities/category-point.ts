import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { $Enums } from '@prisma/client'

export interface CategoryPointProps {
  text: string
  value: number
  icon: $Enums.Icon
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

  set icon(icon: $Enums.Icon) {
    this.props.icon = icon
  }

  set text(description: string) {
    this.props.text = description
  }

  set value(pointValue: number) {
    this.props.value = pointValue
  }

  static create(props: CategoryPointProps, id?: UniqueEntityID) {
    const categoryPoint = new CategoryPoint(props, id)

    return categoryPoint
  }
}
