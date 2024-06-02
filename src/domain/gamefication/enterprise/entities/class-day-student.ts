import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClassDayStudentProps {
  classDayId: UniqueEntityID
  studentId: UniqueEntityID
}

export class ClassDayStudent extends Entity<ClassDayStudentProps> {
  get classDayId() {
    return this.props.classDayId
  }

  get studentId() {
    return this.props.studentId
  }

  static create(props: ClassDayStudentProps, id?: UniqueEntityID) {
    const classDayStudent = new ClassDayStudent(props, id)
    return classDayStudent
  }
}
