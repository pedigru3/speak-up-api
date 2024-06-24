import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateCategoryPoint } from './controllers/create-category-point.controller'
import { GetInfoController } from './controllers/get-info.controller'
import { UpdateUserController } from './controllers/update-user.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateTaskUseCase } from '@/domain/gamefication/aplication/use-cases/create-task'
import { CreateTaskController } from './controllers/create-task.controller'
import { FetchRecentAnswersController } from './controllers/fetch-recent-answers.controller'
import { FetchRecentAnswersUseCase } from '@/domain/gamefication/aplication/use-cases/fetch-recent-answers'
import { RegisterStudentUseCase } from '@/domain/gamefication/aplication/use-cases/students/register-student'
import { AuthenticateStudentUseCase } from '@/domain/gamefication/aplication/use-cases/students/authenticate-student'
import { CryptographModule } from '../cryptograph/cryptograph.module'
import { GetRankingController } from './controllers/get-ranking.controller'
import { FetchRankingUseCase } from '@/domain/gamefication/aplication/use-cases/students/fetch-ranking'
import { GetInfoUseCase } from '@/domain/gamefication/aplication/use-cases/students/get-info'
import { UploadAudioController } from './controllers/upload-audio.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { UploadAndCreateAnswerUseCase } from '@/domain/gamefication/aplication/use-cases/upload-and-create-answer'
import { StorageModule } from '../storage/storage.module'
import { EditStudentUseCase } from '@/domain/gamefication/aplication/use-cases/students/edit-student'
import { CreateJourneyController } from './controllers/create-journey.controller'
import { CreateJourneyUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/create-jorney'
import { FetchRecentJorneysController } from './controllers/fetch-recent-journeys.controller'
import { FetchRecentJourneysUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/fetch-recent-journeys'
import { CreateClassDayController } from './controllers/create-class-day.controller'
import { CreateClassDayUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/create-class-day'
import { GetClassDayController } from './controllers/get-class-day.controller'
import { GetClassDayByIdUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/get-class-day-by-id'
import { UpdateClassDayController } from './controllers/update-class-day.controller'
import { EditClassDayUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/edit-class-day'
import { AddPresenceUseCase } from '@/domain/gamefication/aplication/use-cases/students/add-presence'
import { AddPointUseCase } from '@/domain/gamefication/aplication/use-cases/points/add-points'
import { AuthenticateUserUseCase } from '@/domain/gamefication/aplication/use-cases/students/authenticate-user'
import { GetUserController } from './controllers/get-user.controllet'
import { GetUserByIdUseCase } from '@/domain/gamefication/aplication/use-cases/get-user-by-id'
import { RefreshController } from './controllers/refresh.controller'
import { RefreshUseCase } from '@/domain/gamefication/aplication/use-cases/refresh'
import { AddPointController } from './controllers/add-point.controller'
import { ReadNotificationController } from './controllers/read-notification.controller'
import { ReadNotificationUseCase } from '@/domain/notification/aplication/use-cases/read-notification'
import { FetchCategoryPointsController } from './controllers/fetch-category-points.controller'
import { FetchCategoryPointsUseCase } from '@/domain/gamefication/aplication/use-cases/fetch-category-points'
import { UpdateCategoryPointController } from './controllers/update-category-point.controller'
import { UpdateCategoryPointUseCase } from '@/domain/gamefication/aplication/use-cases/points/update-category-point'
import { DeleteCategoryPointController } from './controllers/delete-category-point.controller'
import { DeleteCategoryPointUseCase } from '@/domain/gamefication/aplication/use-cases/points/delete-category-point'
import { GetJourneyByIdUseCase } from '@/domain/gamefication/aplication/use-cases/jorney/get-journey'
import { GetJourneyController } from './controllers/get-journey.controller'
import { FetchStudentsController } from './controllers/fetch-students.controller'
import { FetchStudentsUseCase } from '@/domain/gamefication/aplication/use-cases/students/fetch-studants'

@Module({
  imports: [DatabaseModule, CryptographModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateJourneyController,
    CreateCategoryPoint,
    GetInfoController,
    UpdateUserController,
    UpdateClassDayController,
    CreateTaskController,
    CreateClassDayController,
    FetchRecentAnswersController,
    FetchRecentJorneysController,
    GetRankingController,
    GetClassDayController,
    GetUserController,
    UploadAudioController,
    UploadAttachmentController,
    RefreshController,
    AddPointController,
    ReadNotificationController,
    FetchCategoryPointsController,
    UpdateCategoryPointController,
    DeleteCategoryPointController,
    GetJourneyController,
    FetchStudentsController,
  ],
  providers: [
    FetchStudentsUseCase,
    GetJourneyByIdUseCase,
    UpdateCategoryPointUseCase,
    FetchCategoryPointsUseCase,
    ReadNotificationUseCase,
    AddPresenceUseCase,
    AddPointUseCase,
    CreateJourneyUseCase,
    CreateClassDayUseCase,
    CreateTaskUseCase,
    EditStudentUseCase,
    EditClassDayUseCase,
    FetchRecentAnswersUseCase,
    GetClassDayByIdUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    AuthenticateUserUseCase,
    RefreshUseCase,
    FetchRankingUseCase,
    FetchRecentJourneysUseCase,
    GetInfoUseCase,
    GetUserByIdUseCase,
    UploadAndCreateAnswerUseCase,
    DeleteCategoryPointUseCase,
  ],
})
export class HttpModule {}
