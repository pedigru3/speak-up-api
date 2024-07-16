import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaTasksRepository } from './prisma/repositories/prisma-tasks-repository'
import { PrismaTasksAttachmentsRepository } from './prisma/repositories/prisma-tasks-attachments-repository'
import { PrismaAnswersCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository'
import { TasksRepository } from '@/domain/gamefication/aplication/repositories/tasks-repository'
import { PrismaTeacherRepository } from './prisma/repositories/prisma-teachers-repository'
import { TeachersRepository } from '@/domain/gamefication/aplication/repositories/teachers-repository'
import { AnswersRepository } from '@/domain/gamefication/aplication/repositories/answers-repository'
import { StudentsRepository } from '@/domain/gamefication/aplication/repositories/students-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-students-repository'
import { PointsRepository } from '@/domain/gamefication/aplication/repositories/points-repository'
import { PrismaPointsRepository } from './prisma/repositories/prisma-points-repository'
import { JourneysRepository } from '@/domain/gamefication/aplication/repositories/jorney-repository'
import { PrismaJourneysRepository } from './prisma/repositories/prisma-journey-repository'
import { ClassDayRepository } from '@/domain/gamefication/aplication/repositories/class-day-repository'
import { PrismaClassDaysRepository } from './prisma/repositories/prisma-class-day-repository'
import { ClassDayStudentsRepository } from '@/domain/gamefication/aplication/repositories/class-day-students-repository'
import { PrismaClassDaysStudentsRepository } from './prisma/repositories/prisma-class-day-students-repository'
import { CacheModule } from '../cache/cache.module'
import { UsersRepository } from '@/domain/gamefication/aplication/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { RefreshTokenRepository } from '@/domain/gamefication/aplication/repositories/refresh-token-repository'
import { PrismaRefreshTokenRepository } from './prisma/repositories/prisma-refresh-token-repository'
import { NotificationsRepository } from '@/domain/notification/aplication/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { CategoryPointsRepository } from '@/domain/gamefication/aplication/repositories/category-points-repository'
import { PrismaCategoryPointsRepository } from './prisma/repositories/prisma-category-points-repository'
import { EnvModule } from '../env/env.module'
import { NotificationService } from '../notifications/notification.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [CacheModule, EnvModule, HttpModule],
  providers: [
    PrismaService,
    { provide: TasksRepository, useClass: PrismaTasksRepository },
    { provide: TeachersRepository, useClass: PrismaTeacherRepository },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    { provide: StudentsRepository, useClass: PrismaStudentRepository },
    { provide: PointsRepository, useClass: PrismaPointsRepository },
    { provide: JourneysRepository, useClass: PrismaJourneysRepository },
    { provide: ClassDayRepository, useClass: PrismaClassDaysRepository },
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    {
      provide: ClassDayStudentsRepository,
      useClass: PrismaClassDaysStudentsRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: CategoryPointsRepository,
      useClass: PrismaCategoryPointsRepository,
    },
    PrismaTasksAttachmentsRepository,
    PrismaAnswersCommentsRepository,
    NotificationService,
  ],
  exports: [
    PrismaService,
    TasksRepository,
    TeachersRepository,
    UsersRepository,
    StudentsRepository,
    AnswersRepository,
    PointsRepository,
    JourneysRepository,
    ClassDayRepository,
    ClassDayStudentsRepository,
    RefreshTokenRepository,
    PrismaTasksAttachmentsRepository,
    PrismaAnswersCommentsRepository,
    NotificationsRepository,
    CategoryPointsRepository,
    NotificationService,
  ],
})
export class DatabaseModule {}
