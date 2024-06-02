import { AnswerComment } from '@/domain/gamefication/enterprise/entities/answer-comment'

export abstract class AnswersCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
