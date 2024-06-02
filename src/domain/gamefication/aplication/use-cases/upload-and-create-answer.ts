import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AnswersRepository } from '../repositories/answers-repository'
import { StudentsRepository } from '../repositories/students-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Answer } from '@/domain/gamefication/enterprise/entities/answer'
import { Uploader } from '../storage/uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { TasksRepository } from '../repositories/tasks-repository'

interface UploadAndCreateAnswerUseCaseRequest {
  taskId: string
  studentId: string
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  Answer
>

@Injectable()
export class UploadAndCreateAnswerUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private answersRepository: AnswersRepository,
    private tasksRepository: TasksRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    studentId,
    taskId,
    fileName,
    fileType,
    body,
  }: UploadAndCreateAnswerUseCaseRequest): Promise<UploadAndCreateAnswerUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError())
    }

    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      return left(new ResourceNotFoundError())
    }

    if (!/^audio\/[a-zA-Z0-9-]+$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const answer = Answer.create({
      studantId: new UniqueEntityID(studentId),
      taskId: new UniqueEntityID(taskId),
      url,
    })

    await this.answersRepository.create(answer)

    return right(answer)
  }
}
