import { User } from '@/domain/gamefication/enterprise/entities/user'

export class UserPresenter {
  static toHttp({ user }: { user: User }) {
    return {
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    }
  }
}
