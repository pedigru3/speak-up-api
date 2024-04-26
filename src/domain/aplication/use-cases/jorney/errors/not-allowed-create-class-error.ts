import { UseCaseError } from '@/core/errors/use-cases-error'

export class NotAllowedCreateClassError extends Error implements UseCaseError {
  constructor() {
    super(`Number of classes reached the limit.`)
  }
}
