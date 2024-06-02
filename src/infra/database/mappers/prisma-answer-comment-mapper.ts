import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/gamefication/enterprise/entities/answer-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    return AnswerComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        answerId: new UniqueEntityID(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(answer: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
      answerId: answer.answerId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
