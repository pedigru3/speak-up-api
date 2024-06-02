import { WatchedList } from '@/core/entities/watched-list'
import { ClassDayStudent } from './class-day-student'

export class ClassDayStudentList extends WatchedList<ClassDayStudent> {
  compareItems(a: ClassDayStudent, b: ClassDayStudent): boolean {
    return a.studentId.equals(b.studentId)
  }
}
