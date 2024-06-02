import { WatchedList } from '@/core/entities/watched-list'
import { JorneyDay } from './jorney-day'

export class JorneyDayList extends WatchedList<JorneyDay> {
  compareItems(a: JorneyDay, b: JorneyDay): boolean {
    return a.classDayId.equals(b.classDayId)
  }
}
