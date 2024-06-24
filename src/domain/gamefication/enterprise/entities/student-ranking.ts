import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface StudentRankingProps {
  name: string
  avatar?: string | null
  points: number
  daysInARow: number
}

export class StudentRanking extends Entity<StudentRankingProps> {
  get name() {
    return this.props.name
  }

  get points() {
    return this.props.points
  }

  get avatar() {
    return this.props.avatar
  }

  set points(value: number) {
    this.props.points = value
  }

  get level() {
    if (this.points <= 0) {
      return 1
    }
    let level = 0
    let points = 0
    let accumulatedPoints = 3
    for (let i = 0; points < this.points; i++) {
      points += accumulatedPoints
      accumulatedPoints += 1
      level += 1
    }
    return level
  }

  get daysInARow() {
    return this.props.daysInARow
  }

  set daysInARow(value: number) {
    this.props.daysInARow = value
  }

  static create(
    props: Optional<StudentRankingProps, 'points' | 'daysInARow'>,
    id?: UniqueEntityID,
  ) {
    const student = new StudentRanking(
      {
        name: props.name,
        avatar: props.avatar,
        points: props.points ?? 0,
        daysInARow: props.daysInARow ?? 0,
      },
      id,
    )
    return student
  }
}
