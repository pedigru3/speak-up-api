import { CategoryPoint } from '@/domain/gamefication/enterprise/entities/category-point'

export class CategoryPointPresenter {
  static toHttp(categoryPoint: CategoryPoint) {
    return {
      id: categoryPoint.id.toString(),
      text: categoryPoint.text,
      icon: categoryPoint.icon,
      value: categoryPoint.value,
    }
  }
}
