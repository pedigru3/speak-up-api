import { UploadParams, Uploader } from '@/domain/gamefication/aplication/storage/uploader'
import { randomUUID } from 'crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }

  async delete(key: string): Promise<void> {
    this.uploads = this.uploads.filter((item) => item.fileName !== key)
  }
}
