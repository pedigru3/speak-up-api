import { AnswersCommentsRepository } from '@/domain/aplication/repositories/answers-comments-repository'
import { AnswerComment } from '@/domain/enterprise/entities/answer-comment'

export class InMemoryAnswersCommentsRepository
  implements AnswersCommentsRepository
{
  public answersComments: AnswerComment[] = []

  async create(answerComment: AnswerComment): Promise<void> {
    this.answersComments.push(answerComment)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.answersComments.find(
      (answerComment) => answerComment.id.toString() === id,
    )
    return answerComment ?? null
  }

  async delete(answer: AnswerComment): Promise<void> {
    const answersComments = this.answersComments.filter(
      (answerFiltered) => answerFiltered.id !== answer.id,
    )

    this.answersComments = answersComments
  }
}
