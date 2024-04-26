import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ClassDayStudentList } from './class-day-student-list'

export interface ClassDayProps {
  jorneyId: UniqueEntityID
  currentDay: number
  date: Date
  attendanceList: ClassDayStudentList
}

export class ClassDay extends AggregateRoot<ClassDayProps> {
  get currentDay() {
    return this.props.currentDay
  }

  get date() {
    return this.props.date
  }

  get attendanceList() {
    return this.props.attendanceList
  }

  get jorneyId() {
    return this.jorneyId
  }

  set attendanceList(attendanceList: ClassDayStudentList) {
    this.props.attendanceList = attendanceList
  }

  static create(
    props: Optional<ClassDayProps, 'attendanceList'>,
    id?: UniqueEntityID,
  ) {
    const day = new ClassDay(
      {
        ...props,
        attendanceList: props.attendanceList ?? new ClassDayStudentList(),
      },
      id,
    )
    return day
  }
}
