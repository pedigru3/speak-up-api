import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from './user'

export type TeacherProps = UserProps

export class Teacher extends User<TeacherProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: TeacherProps, id?: UniqueEntityID) {
    const teacher = new Teacher(props, id)
    return teacher
  }
}
