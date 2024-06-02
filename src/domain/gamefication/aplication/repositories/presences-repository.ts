import { Presence } from '@/domain/gamefication/enterprise/entities/presence'

export abstract class PresencesRepository {
  abstract getLastPresence(studentId: string): Promise<Presence | null>
  abstract create(presence: Presence): Promise<void>
}
