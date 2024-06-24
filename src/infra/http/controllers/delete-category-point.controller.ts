import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteCategoryPointUseCase } from '@/domain/gamefication/aplication/use-cases/points/delete-category-point'

@Controller('/category-point/:id')
export class DeleteCategoryPointController {
  constructor(private deleteCategoryPoint: DeleteCategoryPointUseCase) {}

  @Delete()
  async handler(
    @Param('id') id: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    if (userPayload.role !== 'ADMIN') {
      throw new ForbiddenException('Not allowed')
    }

    if (!id) {
      return new BadRequestException('Invalid id')
    }

    const result = await this.deleteCategoryPoint.execute({
      categorypointId: id,
    })

    if (result.isLeft()) {
      throw new ForbiddenException(result.value.message)
    } else {
      return {}
    }
  }
}
