import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '../../repositories/students-repository'
import { Uploader } from '../../storage/uploader'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Student } from '@/domain/gamefication/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error'

interface EditStudentUseCaseRequest {
  studentId: string
  name?: string
  email?: string
  file?: {
    originalname: string
    buffer: Buffer
    mimetype: string
  }
}

type EditStudentUseCaseResponse = Either<ResourceNotFoundError, Student>

@Injectable()
export class EditStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    studentId,
    file,
    email,
    name,
  }: EditStudentUseCaseRequest): Promise<EditStudentUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError())
    }

    if (file) {
      if (!/\.(jpg|jpeg|png)$/i.test(file.originalname)) {
        return left(new InvalidAttachmentTypeError(file.mimetype))
      }

      const extention = file.originalname.split('.')[1]
      let newType: string | undefined

      if (extention === 'jpg' || extention === 'jpeg') {
        newType = 'image/jpeg'
      } else {
        newType = 'image/png'
      }

      if (student.avatar) {
        await this.uploader.delete(student.avatar)
      }
      const { url } = await this.uploader.upload({
        body: file.buffer,
        fileName: file.originalname,
        fileType: newType,
      })
      student.avatar = url
    }

    if (name) {
      student.name = name
    }

    if (email) {
      student.email = email
    }

    await this.studentsRepository.save(student)

    return right(student)
  }
}
