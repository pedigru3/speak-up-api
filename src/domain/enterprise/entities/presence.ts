import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface PresenceProps {
  date: Date
  studentId: UniqueEntityID
}

export class Presence extends Entity<PresenceProps> {
  get date() {
    return this.props.date
  }

  get studentId() {
    return this.props.studentId
  }

  static create(props: PresenceProps, id?: UniqueEntityID) {
    const presence = new Presence(props, id)

    return presence
  }
}
