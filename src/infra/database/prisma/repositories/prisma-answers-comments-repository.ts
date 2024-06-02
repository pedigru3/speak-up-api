import { AnswersCommentsRepository } from '@/domain/gamefication/aplication/repositories/answers-comments-repository'
import { AnswersRepository } from '@/domain/gamefication/aplication/repositories/answers-repository'
import { AnswerComment } from '@/domain/gamefication/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswersCommentsRepository
  implements AnswersCommentsRepository
{
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.')
  }

  create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
