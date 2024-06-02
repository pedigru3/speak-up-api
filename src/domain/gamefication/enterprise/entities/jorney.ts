import { Optional } from '../../../../core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ClassDay } from './class-day'

export interface JourneyProps {
  classDays: ClassDay[]
  title: string
  description: string
  maxDay: number
  createdAt: Date
}

export class Journey extends AggregateRoot<JourneyProps> {
  get createdAt() {
    return this.props.createdAt
  }

  get currentDay() {
    return this.props.classDays.length
  }

  get maxDay() {
    return this.props.maxDay
  }

  get classDays() {
    return this.props.classDays
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  set classDays(classDay: ClassDay[]) {
    this.props.classDays = classDay
  }

  newClassDay(classDay: ClassDay) {
    this.props.classDays.push(classDay)
  }

  static create(
    props: Optional<JourneyProps, 'createdAt' | 'classDays'>,
    id?: UniqueEntityID,
  ) {
    const jorney = new Journey(
      {
        ...props,
        classDays: props.classDays ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return jorney
  }
}
