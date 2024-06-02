import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { User, UserProps } from './user'

export type StudentProps = UserProps & {
  points: number
  daysInARow: number
  pendingTasks: number
}

export class Student extends User<StudentProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get points() {
    return this.props.points
  }

  get avatar() {
    return this.props.avatar ?? null
  }

  get pendingTasks() {
    return this.props.pendingTasks
  }

  set points(value: number) {
    this.props.points = value
  }

  set avatar(fileName: string | null) {
    this.props.avatar = fileName
  }

  set email(email: string) {
    this.props.email = email
  }

  set name(name: string) {
    this.props.name = name
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
    props: Optional<StudentProps, 'points' | 'daysInARow' | 'pendingTasks'>,
    id?: UniqueEntityID,
  ) {
    const student = new Student(
      {
        name: props.name,
        email: props.email,
        avatar: props.avatar,
        password: props.password,
        refreshToken: props.refreshToken,
        points: props.points ?? 0,
        daysInARow: props.daysInARow ?? 0,
        pendingTasks: props.pendingTasks ?? 0,
        role: props.role,
      },
      id,
    )

    return student
  }
}
