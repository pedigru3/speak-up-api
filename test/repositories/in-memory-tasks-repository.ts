import { TasksRepository } from '@/domain/aplication/repositories/tasks-repository'
import { Task } from '@/domain/enterprise/entities/task'

export class InMemoryTasksRepository implements TasksRepository {
  public tasks: Task[] = []

  async create(task: Task): Promise<void> {
    this.tasks.push(task)
  }

  async getById(id: string): Promise<Task | null> {
    const task = this.tasks.find((task) => task.id.toValue() === id)
    return task ?? null
  }

  async save(task: Task): Promise<void> {
    const itemIndex = this.tasks.findIndex((item) => item.id === task.id)
    this.tasks[itemIndex] = task
  }

  async delete(task: Task): Promise<void> {
    const tasks = this.tasks.filter((getTask) => getTask.id !== task.id)
    this.tasks = tasks
  }
}
