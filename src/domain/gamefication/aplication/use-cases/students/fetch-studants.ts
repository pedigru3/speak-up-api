import { StudentsRepository } from '../../repositories/students-repository'
import { Either, right } from '@/core/either'
import { Student } from '@/domain/gamefication/enterprise/entities/student'
import { Injectable } from '@nestjs/common'

interface FetchStudentsRequest {
  page: number
}

type FetchStudentsResponse = Either<null, Student[]>

@Injectable()
export class FetchStudentsUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    page,
  }: FetchStudentsRequest): Promise<FetchStudentsResponse> {
    const students = await this.studentsRepository.findMany({ page })

    return right(students)
  }
}
