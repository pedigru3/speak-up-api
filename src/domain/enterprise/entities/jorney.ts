import { Optional } from '../../../core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { JorneyDayList } from './jorney-day-list'

export interface JorneyProps {
  jorneyDays: JorneyDayList
  maxDay: number
  createdAt: Date
}

export class Jorney extends AggregateRoot<JorneyProps> {
  get createdAt() {
    return this.props.createdAt
  }

  get currentDay() {
    return this.props.jorneyDays.currentItems.length
  }

  get maxDay() {
    return this.props.maxDay
  }

  get jorneyDays() {
    return this.props.jorneyDays
  }

  set jorneyDays(jorneyDays: JorneyDayList) {
    this.props.jorneyDays = jorneyDays
  }

  static create(
    props: Optional<JorneyProps, 'createdAt' | 'jorneyDays'>,
    id?: UniqueEntityID,
  ) {
    const jorney = new Jorney(
      {
        ...props,
        jorneyDays: props.jorneyDays ?? new JorneyDayList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return jorney
  }
}
