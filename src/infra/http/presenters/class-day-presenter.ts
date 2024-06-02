import { ClassDay } from '@/domain/gamefication/enterprise/entities/class-day'

export class ClassDayPresenter {
  static toHttp({ classDay }: { classDay: ClassDay }) {
    return {
      id: classDay.id.toString(),
      current_day: classDay.currentDay,
      students_presents_ids: classDay.attendanceList.currentItems.map(
        (attendence) => attendence.studentId,
      ),
    }
  }
}
