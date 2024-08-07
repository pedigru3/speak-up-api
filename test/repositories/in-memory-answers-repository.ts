import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/gamefication/aplication/repositories/answers-repository'
import { Answer } from '@/domain/gamefication/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  async create(answer: Answer): Promise<void> {
    this.answers.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.answers.find((answer) => answer.id.toString() === id)
    return answer ?? null
  }

  async findManyRecent({ page }: PaginationParams): Promise<Answer[]> {
    const answers = this.answers
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.answers.findIndex((item) => item.id === answer.id)
    this.answers[itemIndex] = answer

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const answers = this.answers.filter(
      (answerFiltered) => answerFiltered.id.toString() !== answer.id.toString(),
    )

    this.answers = answers
  }
}
