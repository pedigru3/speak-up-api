import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RefreshTokenProps {
  userId: UniqueEntityID
  expiresIn: number
  role: 'ADMIN' | 'USER'
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  get userId() {
    return this.props.userId
  }

  get expiresIn() {
    return this.props.expiresIn
  }

  get role() {
    return this.props.role
  }

  static create(props: RefreshTokenProps, id?: UniqueEntityID) {
    const refreshToken = new RefreshToken(props, id)

    return refreshToken
  }
}
