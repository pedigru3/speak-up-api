export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract delete(key: string): Promise<void>
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
