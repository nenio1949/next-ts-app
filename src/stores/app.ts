/*
 * @Description: 状态管理——AppStore模块
 * @Author: yong.li
 * @Date: 2023-03-06 15:04:41
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-18 09:12:08
 */
import { runInAction, makeAutoObservable } from 'mobx'
import api from '@/services/api'
import { Classification } from '@/pages/useCase/type'
import utils from '@/utils'

class AppStore {
  /** 全部项目 */
  projects: Array<Project> = []

  /** 子系统 */
  subSystems: Array<Classification> = []

  /** 当前选中项目 */
  selectedProject: Project | null = null

  /** 模块切换加载提示 */
  appLoading = false

  /** 七牛token */
  qiniuToken = ''

  /** 用例分类 */
  classifications: Array<Classification> = []

  constructor() {
    makeAutoObservable(this) // 需要observable的值，默认全部（mobx6引入）
  }

  /**
   * 模块加载提示控制
   */
  handleAppLoading() {
    this.appLoading = true
    setTimeout(() => {
      this.appLoading = false
    }, 200)
  }

  /**
   * 获取所有项目
   * @param isForceibly 是否强制更新数据
   */
  async handleGetProjects(isForceibly?: boolean) {
    let newProjects = [...this.projects]

    if (newProjects.length === 0 || isForceibly) {
      const res: ApiResponse = await api.getProjects()

      const projects = res.data

      runInAction(() => {
        if (projects instanceof Array) {
          newProjects = projects

          this.projects = projects
        }
      })
    }

    return newProjects
  }

  /**
   * 切换选中项目
   */
  handleChangeSelectedProject(project: Project) {
    if (project?.id) {
      utils.localstorage.set('_SELECTED_PROJECT', project)
      this.selectedProject = project
    }
  }

  /**
   * 获取七牛配置
   * @param isForceibly 是否强制更新数据
   */
  async handleGetQiniuToken(isForceibly?: boolean) {
    let newQiniuToken = this.qiniuToken

    if (!newQiniuToken || isForceibly) {
      const { errcode, data }: ApiResponse = await api.getQiniuToken()

      if (errcode === 0) {
        runInAction(() => {
          newQiniuToken = data.token

          this.qiniuToken = data.token
        })
      }
    }

    return newQiniuToken
  }

  /**
   *
   * @param type 配置项类型，classifications: 用例分类 ；subsystems：用例子系统
   * @param isForceibly 是否强制更新
   * @returns
   */
  async handleGetConfigurations(type: string, isForceibly?: boolean) {
    let newConfigurations: Array<Classification> = []

    switch (type) {
      case 'classifications':
        newConfigurations = [...this.classifications]
        break
      case 'subsystems':
        newConfigurations = [...this.subSystems]
        break
      default:
        newConfigurations = [...this.classifications]
        break
    }

    if (newConfigurations.length === 0 || isForceibly) {
      const res: ApiResponse = await api.getConfigurations(type)

      runInAction(() => {
        newConfigurations = res.data

        switch (type) {
          case 'classifications':
            this.classifications = res.data
            break
          case 'subsystems':
            this.subSystems = res.data
            break
          default:
            this.classifications = res.data
            break
        }
      })
    }

    return newConfigurations
  }
}

export default AppStore
