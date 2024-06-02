import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { RefreshToken } from './refresh-token'

export interface UserProps {
  name: string
  email: string
  password: string
  avatar?: string | null
  role: 'ADMIN' | 'USER'
  refreshToken: RefreshToken | null
}

export class User<T extends UserProps = UserProps> extends Entity<T> {
  constructor(props: T, id?: UniqueEntityID) {
    super(props, id)
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get avatar() {
    return this.props.avatar
  }

  get role() {
    return this.props.role
  }

  get refreshToken() {
    return this.props.refreshToken
  }

  set refreshToken(refreshToken: RefreshToken | null) {
    this.props.refreshToken = refreshToken
  }

  static create(
    props: Optional<UserProps, 'refreshToken'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        refreshToken: props.refreshToken ?? null,
      },
      id,
    )
    return user
  }
}
