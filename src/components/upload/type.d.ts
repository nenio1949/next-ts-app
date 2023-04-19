export interface Extra {
  /** 文件原文件名 */
  fname: string
  /** 用来放置自定义变量 */
  customVars?: {
    [key: string]: string
  }
  /** 自定义元信息 */
  metadata?: {
    [key: string]: string
  }
  /** 文件类型设置 */
  mimeType?: string
}

/** 上传文件回调 */
export interface UploadCallbackFile {
  name: string
  url?: string | undefined
}

export interface RcFile extends File {
  uid: string
}
