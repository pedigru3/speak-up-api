import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ClassDayStudentList } from './class-day-student-list'

export interface ClassDayProps {
  jorneyId: UniqueEntityID
  currentDay: number
  maxDay: number
  date: Date
  classDayStudentList: ClassDayStudentList
}

export class ClassDay extends AggregateRoot<ClassDayProps> {
  get currentDay() {
    return this.props.currentDay
  }

  get date() {
    return this.props.date
  }

  get attendanceList() {
    return this.props.classDayStudentList
  }

  get jorneyId() {
    return this.props.jorneyId
  }

  get maxDay() {
    return this.props.maxDay
  }

  set attendanceList(attendanceList: ClassDayStudentList) {
    this.props.classDayStudentList = attendanceList
  }

  static create(
    props: Optional<ClassDayProps, 'classDayStudentList'>,
    id?: UniqueEntityID,
  ) {
    const day = new ClassDay(
      {
        ...props,
        classDayStudentList:
          props.classDayStudentList ?? new ClassDayStudentList(),
      },
      id,
    )
    return day
  }
}
