import { promises } from 'fs'
import { resolve } from 'path'
import { TMP_FOLDER, UPLOADS_FOLDER } from '../../configs/upload'

export class DiskStorage {
  async saveFile(file: string) {
    await promises.rename(
      resolve(TMP_FOLDER, file),
      resolve(UPLOADS_FOLDER, file),
    )

    return file
  }

  async deleteFile(file: string) {
    const filePath = resolve(UPLOADS_FOLDER, file)

    try {
      await promises.stat(filePath)
    } catch {
      return
    }

    await promises.unlink(filePath)
  }
}
