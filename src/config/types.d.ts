/**
 * 全局配置声明
 */
interface IGConfig {
  serverHost?: string
  docHost: string
  filePreviewServiceHost: string
  uploadQiNiuUrl: string
  manualUrl: string
  system: {
    name: string
    logoUrl: string
    version: {
      code: string
      name?: string
    }
  }
  maxUploadSize: number
  enum: EnumConfig
  uploadTemplateUrl: {
    useCase: {
      up: string
      down: string
    }
  }
  formItemLayout: {
    labelCol: {
      span: number
    }
    wrapperCol: {
      span: number
    }
  }
}

/** 枚举对象声明 */
interface EnumConfigObj {
  value: string
  label: string
}

/**
 * 枚举配置声明
 */
interface EnumConfig {
  useCaseSources: Array<EnumConfigObj>
  useCaseStates: Array<EnumConfigObj>
  useCaseSearchStates: Array<EnumConfigObj>
  useCaseUpdateTypes: Array<EnumConfigObj>
  useCaseAttributes: Array<EnumConfigObj>
  useCaseTestResults: Array<EnumConfigObj>
}

/**
 * 对象声明
 */
interface KeyValueObject {
  [key: string]: object
}

/**
 * 网络请求返回内容声明
 */
interface ApiResponse {
  errcode: number
  msg: string
  data: Data
}

/**
 * 项目声明
 */
interface Project {
  active: boolean
  id: number
  name: string
  number: number
  pinyin: string
  region: string
  status: {
    id: string
    name: string
  }
  subType: {
    id: string
    name: string
  }
}
