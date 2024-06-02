import { Task } from '../../enterprise/entities/task'

export abstract class TasksRepository {
  abstract create(task: Task): Promise<void>
  abstract save(task: Task): Promise<void>
  abstract findById(id: string): Promise<Task | null>
  abstract delete(task: Task): Promise<void>
}
