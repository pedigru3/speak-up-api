import { CardsRepository } from '@/domain/cards/aplication/repositories/card-repository'
import { Card } from '@/domain/cards/enterprise/entities/card'

export class InMemoryCardsRepository implements CardsRepository {
  public cards: Card[] = []

  async create(card: Card): Promise<void> {
    this.cards.push(card)
  }

  async findById(id: string): Promise<Card | null> {
    const card = this.cards.find((card) => card.id.toValue() === id)
    return card ?? null
  }

  async save(card: Card): Promise<void> {
    const itemIndex = this.cards.findIndex((item) => item.id === card.id)
    this.cards[itemIndex] = card
  }

  async delete(card: Card): Promise<void> {
    const cards = this.cards.filter((getCard) => getCard.id !== card.id)
    this.cards = cards
  }
}
