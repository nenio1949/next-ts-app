import React from 'react'

export interface Condition {
  state?: string
  source?: string
  name?: string
  classification_id?: number
}

export interface DisabledStateText {
  [key: string]: ReactNode
}

export interface IStates {
  selectedKeys: React.Key[]
  visible: boolean
  loading: boolean
  hasOperateAuth: boolean
  classifications: Array<Classification>
  qiniuToken: string | undefined
  useCases: Array<UseCase>
  columns: Array<object>
  pagination: TablePaginationConfig
  condition: {
    [key: string]: string | Array<string> | number | null
  }
  subDrawer: {
    title: string
    width: string | number
    component: ReactNode
  }
}

/** 用例分类 */
export interface Classification {
  id: number
  name: string
  default: boolean
}

/** 基础用例 */
export interface UseCase {
  id: number
  nums: number
  version: string
  subsystem: {
    id: string
    name: string
  }
  type: string
  state: {
    id: string
    name: string
  }
  source: {
    id: string
    name: string
  }
  classification: {
    id: number
    name: string
  }
  user: {
    id: number
    name: string
  }
  time: string
  name: string
  changeFiles: Data[]
  contrast: {
    url: string
    name: string
  }
}

export interface FilterPorps {
  classifications: Array<Classification>
  condition: Condition
  onCallbackParent: (condition: Condition) => void
  hasOperateAuth: boolean
  setSelectedKeys: (keys: React.Key[]) => void
  handleOperate: (type?: string) => void
  selectedKeys: React.Key[]
  loading: boolean
}
