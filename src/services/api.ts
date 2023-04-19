/*
 * @Description: 接口配置
 * @Author: yong.li
 * @Date: 2022-01-21 15:59:03
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-17 14:42:21
 */
import axios from './request'
/** --------------------------------------------------------公共请求开始-------------------------------------------- */

/** 登录 */
const login = async (datas: object) => {
  return axios('/api/jwt/login', 'POST', datas)
}
/** 获取当前登录人员的信息*/
const getUser = async () => {
  return axios('/api/web/users/info', 'GET')
}

/** 刷新token */
const refreshToken = async (datas: object) => {
  return axios('/api/jwt/refresh_token', 'POST', datas)
}
/** 获取七牛token */
const getQiniuToken = async () => {
  return axios('/api/web/qiniu', 'GET', null)
}
/** 获取当前登录人员的所有项目 */
const getProjects = async () => {
  return axios('/api/web/projects', 'GET')
}
/** 获取当前登录人员的所有项目 */
const getAllProjects = async () => {
  return axios('/api/web/projects', 'GET', {
    type: 'all'
  })
}
/** 获取配置项 */
const getConfigurations = async (type: string) => {
  return axios(`/api/web/configurations?type=${type}`, 'GET', null)
}
/** 更新自己的密码 */
const changePassword = async (datas: object) => {
  return axios('/api/web/password', 'POST', datas)
}
/** 获取忘记密码的验证码 */
const getResetPasswordSmsCode = async (datas: object) => {
  return axios('/share-api/sms-code', 'POST', datas)
}
/** 重置密码 */
const resetPassword = async (datas: object) => {
  return axios('/share-api/reset-password', 'POST', datas)
}
/** 获取当前是否有文件正在解析 */
const getTaskProcess = async () => {
  return axios('/api/web/process', 'GET', null)
}
/** 获取全部岗位 */
const getPosts = async () => {
  return axios('/api/web/posts', 'GET', null)
}
/** 获取全部标准岗位 */
const getStandardPosts = async () => {
  return axios('/api/web/standard-posts', 'GET', null)
}
/** 创建项目人员 */
const createProjectUser = async (projectId: number, datas: object) => {
  return axios(`/api/web/project/${projectId}/user`, 'POST', datas)
}
/** 修改项目人员 */
const updateProjectUser = async (projectId: number, userId: number, datas: object) => {
  return axios(`/api/web/project/${projectId}/users/${userId}`, 'POST', datas)
}
/** 获取所有权限 */
const getAuthorities = async () => {
  return axios('/api/web/authorities', 'GET', null)
}
/** 获取指定权限 */
const getAuthoritie = async (id: number) => {
  return axios(`/api/web/authorities/${id}`, 'GET', null)
}
/** 修改指定权限 */
const updateAuthoritie = async (id: number, datas: object) => {
  return axios(`/api/web/authorities/${id}`, 'POST', datas)
}
/** 获取当前用户的权限 */
const getUserAuthorities = async (datas: object) => {
  return axios('/api/web/user/authorities/', 'GET', datas)
}
/** 获取项目人员 */
const getProjectUsers = async (projectId: number, datas: object) => {
  return axios(`/api/web/project/${projectId || 0}/users`, 'GET', datas)
}

/** 获取消息推送范围 */
const getSettingMessage = async () => {
  return axios(`/api/web/message`, 'GET')
}

/** --------------------------------------------------------公共请求结束-------------------------------------------- */

/** --------------------------------------------------------基础用例库管理开始-------------------------------------------- */
/** 获取基础用例库列表 */
const getUseCases = async (datas: object) => {
  return axios('/api/web/templates', 'GET', datas)
}
/** 下载用例 */
const downloadUseCase = async (id: number) => {
  return axios(`/api/web/templates/${id}/template?type=case`, 'GET', null, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}
/** 下载用例 */
const downloadMergeUseCase = async (datas: string) => {
  return axios(`/api/web/templates/template`, 'POST', { ids: datas })
}

/** 创建基础用例库 */
const createUseCase = async (datas: object) => {
  return axios('/api/web/v1/template', 'POST', datas)
}
/** 创建基础用例库 */
const createProjectUseCase = async (datas: object, projectId: number) => {
  return axios(`/api/web/v1/project/${projectId}/template`, 'POST', datas)
}
/** 更新基础用例库 */
const updateUseCase = async (id: number, datas: object) => {
  return axios(`/api/web/templates/${id}`, 'POST', datas, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}
/** 更新基础用例库对照表 */
const updateUseCaseContrast = async (id: number, datas: object) => {
  return axios(`/api/web/templates/${id}/contrast`, 'POST', datas, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}
/** 获取指定基础用例库版本列表 */
const getUseCaseVersions = async (id: number, datas: object) => {
  return axios(`/api/web/templates/${id}`, 'GET', datas, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}
/** 下载用例库对照表 */
const downloadUseCaseContrast = async (id: number) => {
  return axios(`/api/web/templates/${id}/template?type=contrast`, 'GET', null, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

/** --------------------------------------------------------基础用例库管理结束-------------------------------------------- */

export default {
  login,
  getUser,
  refreshToken,
  getQiniuToken,
  getProjects,
  getAllProjects,
  getConfigurations,
  changePassword,
  getResetPasswordSmsCode,
  resetPassword,
  getTaskProcess,
  getPosts,
  getStandardPosts,
  createProjectUser,
  updateProjectUser,
  getAuthorities,
  getAuthoritie,
  updateAuthoritie,
  getUserAuthorities,
  getProjectUsers,
  getSettingMessage,

  getUseCases,
  downloadUseCase,
  downloadMergeUseCase,
  createUseCase,
  createProjectUseCase,
  updateUseCase,
  updateUseCaseContrast,
  getUseCaseVersions,
  downloadUseCaseContrast
}
