import { Journey } from '@/domain/gamefication/enterprise/entities/jorney'

export class JourneyPresenter {
  static toHttp({ journey }: { journey: Journey }) {
    return {
      id: journey.id.toString(),
      title: journey.title,
      description: journey.description,
      max_day: journey.maxDay,
      current_day: journey.currentDay,
      class_days_ids: journey.classDays.map((item) => item.id.toString()),
      created_at: journey.createdAt,
    }
  }
}
