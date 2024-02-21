import { diskStorage } from 'multer'
import { resolve } from 'path'
import { randomBytes } from 'crypto'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

export const TMP_FOLDER = resolve(__dirname, '..', '..', 'tmp')

export const UPLOADS_FOLDER = resolve(TMP_FOLDER, 'uploads')

export const MULTER: MulterOptions = {
  storage: diskStorage({
    destination: TMP_FOLDER,
    filename(_, file, callback) {
      const fileHash = randomBytes(10).toString('hex')
      const fileName = `${fileHash}-${file.originalname}`

      return callback(null, fileName)
    },
  }),
}
