import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface JorneyDayProps {
  jorneyId: UniqueEntityID
  classDayId: UniqueEntityID
}

export class JorneyDay extends Entity<JorneyDayProps> {
  get jorneyId() {
    return this.props.jorneyId
  }

  get classDayId() {
    return this.props.classDayId
  }

  static create(props: JorneyDayProps, id?: UniqueEntityID) {
    const jorneyPresence = new JorneyDay(props, id)
    return jorneyPresence
  }
}
