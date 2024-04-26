import { Either, left, rigth } from '@/core/either'

import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../../repositories/students-repository'
import { Student } from '@/domain/enterprise/entities/student'
import { HashGenerator } from '../../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<StudentAlreadyExistsError, Student>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const userWithSomeEmail = await this.studentsRepository.findByEmail(email)

    if (userWithSomeEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return rigth(student)
  }
}
