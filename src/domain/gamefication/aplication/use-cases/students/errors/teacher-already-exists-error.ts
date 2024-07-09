import { UseCaseError } from '@/core/errors/use-cases-error'

export class TeacherAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Teacher ${identifier} with same email already exists.`)
  }
}
