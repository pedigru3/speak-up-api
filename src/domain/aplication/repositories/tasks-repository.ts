import { Task } from '../../enterprise/entities/task'

export interface TasksRepository {
  create(task: Task): Promise<void>
  save(task: Task): Promise<void>
  getById(id: string): Promise<Task | null>
  delete(task: Task): Promise<void>
}
