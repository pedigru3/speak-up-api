import { Card } from '../../enterprise/entities/card'

export abstract class CardsRepository {
  abstract create(card: Card): Promise<void>
  abstract save(card: Card): Promise<void>
  abstract findById(id: string): Promise<Card | null>
  abstract delete(card: Card): Promise<void>
}
