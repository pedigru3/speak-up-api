import { Answer } from '@/domain/enterprise/entities/answer'

export class AnswerPresenter {
  static toHttp(answer: Answer) {
    return {
      id: answer.id,
      authorId: answer.authorId,
      url: answer.url,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
