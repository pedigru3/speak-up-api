import { Either, left, right } from '@/core/either'
import { Uploader } from '../../storage/uploader'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error'
import { UsersRepository } from '../../repositories/users-repository'
import { User } from '@/domain/gamefication/enterprise/entities/user'

interface EditStudentUseCaseRequest {
  userId: string
  name?: string
  email?: string
  file?: {
    originalname: string
    buffer: Buffer
    mimetype: string
  }
}

type EditStudentUseCaseResponse = Either<ResourceNotFoundError, User>

@Injectable()
export class EditStudentUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    userId,
    file,
    email,
    name,
  }: EditStudentUseCaseRequest): Promise<EditStudentUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
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

      if (user.avatar) {
        await this.uploader.delete(user.avatar)
      }
      const { url } = await this.uploader.upload({
        body: file.buffer,
        fileName: file.originalname,
        fileType: newType,
      })
      user.avatar = url
    }

    if (name) {
      user.name = name
    }

    if (email) {
      user.email = email
    }

    await this.usersRepository.save(user)

    return right(user)
  }
}
