import { Body, Controller, ForbiddenException, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateTaskUseCase } from '@/domain/gamefication/aplication/use-cases/create-task'

const createTaskBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateTaskBodySchema = z.infer<typeof createTaskBodySchema>

@Controller('/task')
export class CreateTaskController {
  constructor(private createTask: CreateTaskUseCase) {}

  @Post()
  async handler(
    @Body(new ZodValidationPipe(createTaskBodySchema))
    body: CreateTaskBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { content, title } = createTaskBodySchema.parse(body)

    const result = await this.createTask.execute({
      title,
      content,
      teacherId: userPayload.sub,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new ForbiddenException(result.value.message)
    } else {
      return result.value
    }
  }
}
