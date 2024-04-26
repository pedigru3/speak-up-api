import { StudentsRepository } from '../../repositories/students-repository'
import { Either, rigth } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentRanking } from '@/domain/enterprise/entities/student-ranking'

interface FetchRankingRequest {
  page: number
  date?: string
}

type FetchRankingResponse = Either<null, StudentRanking[]>

@Injectable()
export class FetchRankingUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    page,
    date,
  }: FetchRankingRequest): Promise<FetchRankingResponse> {
    const students = await this.studentsRepository.findManyByRanking(
      { page },
      date,
    )

    return rigth(students)
  }
}
