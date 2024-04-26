import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface StudentPresenceProps {
  name: string
  presenceId?: UniqueEntityID | null
}

export class StudentPresence extends Entity<StudentPresenceProps> {
  get name() {
    return this.props.name
  }

  get presenceId() {
    return this.props.presenceId
  }

  get isPresence() {
    return !!this.props.presenceId
  }

  static create(props: StudentPresenceProps, id?: UniqueEntityID) {
    const student = new StudentPresence(props, id)
    return student
  }
}
