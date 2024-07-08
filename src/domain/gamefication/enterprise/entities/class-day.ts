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

  toJson() {
    return JSON.stringify({
      id: this.id.toString(),
      jorneyId: this.jorneyId.toString(),
      currentDay: this.currentDay,
      maxDay: this.maxDay,
      date: this.date,
      classDayStudentList: this.attendanceList.toJson(),
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(datajson: any) {
    const data = JSON.parse(datajson)
    return ClassDay.create(
      {
        jorneyId: new UniqueEntityID(data.jorneyId),
        currentDay: data.currentDay,
        maxDay: data.maxDay,
        date: new Date(data.date),
        classDayStudentList: ClassDayStudentList.fromJson(
          data.classDayStudentList,
        ),
      },
      new UniqueEntityID(data.id),
    )
  }
}
