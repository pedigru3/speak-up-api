import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateCategoryPoint } from './controllers/create-category-point.controller'
import { GetInfoController } from './controllers/get-info.controller'
import { UpdateUserController } from './controllers/update-user.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateTaskUseCase } from '@/domain/aplication/use-cases/create-task'
import { CreateTaskController } from './controllers/create-task.controller'
import { FetchRecentAnswersController } from './controllers/fetch-recent-answers.controller'
import { FetchRecentAnswersUseCase } from '@/domain/aplication/use-cases/fetch-recent-answers'
import { RegisterStudentUseCase } from '@/domain/aplication/use-cases/students/register-student'
import { AuthenticateStudentUseCase } from '@/domain/aplication/use-cases/students/authenticate-student'
import { CryptographModule } from '../cryptograph/cryptograph.module'
import { GetRankingController } from './controllers/get-ranking.controller'
import { FetchRankingUseCase } from '@/domain/aplication/use-cases/students/fetch-ranking'
import { GetInfoUseCase } from '@/domain/aplication/use-cases/students/get-info'
import { UploadAudioController } from './controllers/upload-audio.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { UploadAndCreateAnswerUseCase } from '@/domain/aplication/use-cases/upload-and-create-answer'
import { StorageModule } from '../storage/storage.module'
import { EditStudentUseCase } from '@/domain/aplication/use-cases/students/edit-student'

@Module({
  imports: [DatabaseModule, CryptographModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryPoint,
    GetInfoController,
    UpdateUserController,
    CreateTaskController,
    FetchRecentAnswersController,
    GetRankingController,
    UploadAudioController,
    UploadAttachmentController,
  ],
  providers: [
    CreateTaskUseCase,
    EditStudentUseCase,
    FetchRecentAnswersUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    FetchRankingUseCase,
    GetInfoUseCase,
    UploadAndCreateAnswerUseCase,
  ],
})
export class HttpModule {}
