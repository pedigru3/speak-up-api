import { Either, left, right } from '@/core/either'

import { Injectable } from '@nestjs/common'
import { Teacher } from '@/domain/gamefication/enterprise/entities/teacher'
import { HashGenerator } from '../../cryptography/hash-generator'
import { TeachersRepository } from '../../repositories/teachers-repository'
import { TeacherAlreadyExistsError } from './errors/teacher-already-exists-error'

interface RegisterTeacherUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterTeacherUseCaseResponse = Either<TeacherAlreadyExistsError, Teacher>

@Injectable()
export class RegisterTeacherUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterTeacherUseCaseRequest): Promise<RegisterTeacherUseCaseResponse> {
    const userWithSomeEmail = await this.teachersRepository.findByEmail(email)

    if (userWithSomeEmail) {
      return left(new TeacherAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const teacher = Teacher.create({
      name,
      email,
      password: hashedPassword,
      refreshToken: null,
      role: 'ADMIN',
    })

    await this.teachersRepository.create(teacher)

    return right(teacher)
  }
}
