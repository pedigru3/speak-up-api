import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaTasksRepository } from './prisma/repositories/prisma-tasks-repository'
import { PrismaTasksAttachmentsRepository } from './prisma/repositories/prisma-tasks-attachments-repository'
import { PrismaAnswersCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository'
import { TasksRepository } from '@/domain/aplication/repositories/tasks-repository'
import { PrismaTeacherRepository } from './prisma/repositories/prisma-teachers-repository'
import { TeachersRepository } from '@/domain/aplication/repositories/teachers-repository'
import { AnswersRepository } from '@/domain/aplication/repositories/answers-repository'
import { StudentsRepository } from '@/domain/aplication/repositories/students-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-students-repository'
import { PointsRepository } from '@/domain/aplication/repositories/points-repository'
import { PrismaPointsRepository } from './prisma/repositories/prisma-points-repository'

@Module({
  providers: [
    PrismaService,
    { provide: TasksRepository, useClass: PrismaTasksRepository },
    { provide: TeachersRepository, useClass: PrismaTeacherRepository },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    { provide: StudentsRepository, useClass: PrismaStudentRepository },
    { provide: PointsRepository, useClass: PrismaPointsRepository },
    PrismaTasksAttachmentsRepository,
    PrismaAnswersCommentsRepository,
  ],
  exports: [
    PrismaService,
    TasksRepository,
    TeachersRepository,
    StudentsRepository,
    AnswersRepository,
    PointsRepository,
    PrismaTasksAttachmentsRepository,
    PrismaAnswersCommentsRepository,
  ],
})
export class DatabaseModule {}
