import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AswerTaskUseCase } from './answer-task'

let inMemoryAnswersRepository: InMemoryAnswersRepository

describe('Ansewr Task', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
  })

  it('shold answer a task', async () => {
    const answerTask = new AswerTaskUseCase(inMemoryAnswersRepository)

    const result = await answerTask.execute({
      content: 'Olá',
      studantId: '1',
      taskId: '1',
    })

    if (result.isLeft()) {
      return new Error('Não pode ser Left')
    }

    expect(result.value.content).toBe('Olá')
    expect(result.value.id).toBeTruthy()
  })
})
