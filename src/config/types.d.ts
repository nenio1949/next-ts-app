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
