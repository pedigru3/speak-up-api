import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Jorney, JorneyProps } from '@/domain/enterprise/entities/jorney'

export function makeJorney(
  override: Partial<JorneyProps> = {},
  id?: UniqueEntityID,
) {
  const jorney = Jorney.create(
    {
      maxDay: 20,
      ...override,
    },
    id,
  )
  return jorney
}

// @Injectable()
// export class JorneyFaktore {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaTask(data: Partial<JorneyProps> = {}): Promise<Jorney> {
//     const jorney = makeJorney(data)

//     await this.prisma.task.create({
//       data: PrismaJorneyMapper.toPrisma(jorney),
//     })

//     return jorney
//   }
// }
