/*
 * @Description: 操作类
 * @Author: yong.li
 * @Date: 2023-03-06 14:39:11
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-18 14:59:11
 */
import CryptoJS from 'crypto-js'
import { message } from 'antd'
import { intersection as _intersection } from 'lodash'
import moduleGroupAuthCodeConfig from '@/config/moduleGroupAuthCode'
import GConfig from '@/config/global'
import localstorage from './localstorage'

const aseKey = 'tct-easywork-funenc' // 秘钥

interface UserAuthObject {
  name: never
  code: never
}

export interface ModuleGroupAuth {
  [key: string]: boolean
}

/**
 * @author: yong.li
 * @description crypt加密
 * @param {object | string | number | boolean} content 需要加密的信息
 * @return {*}
 */
const encrypt = (content: object | string | number | boolean) => {
  if (typeof content !== 'boolean' && !content) {
    message.error('需要加密的信息不能为空！')
    return false
  }

  const messageStr = content instanceof Object ? JSON.stringify(content) : content.toString()

  const ciphertext = CryptoJS.AES.encrypt(messageStr, aseKey).toString()

  return ciphertext
}

/**
 * @author: yong.li
 * @description crypt解密
 * @param {string} encryptStr 需要解密的内容
 * @return {*}
 */
const decrypt = (encryptStr: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptStr, aseKey)
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

  return decryptedData
}

/**
 * @author: yong.li
 * @description: 拆分url的params部分
 * @param {*}
 * @return {*}
 */
const splitUrlParams = () => {
  const nowUrl = window.location.pathname
  const nowUrlArray = nowUrl.split('?')[0].split('/') // 根目录会是两个空串["",""]
  const realKeys = nowUrlArray.filter(Boolean)

  return realKeys
}

/**
 * @author: yong.li
 * @description: 附件根据URL获取文件名
 * @param {string} fileUrl 文件url
 * @return {*}
 */
const splitUrlFileName = (fileUrl: string) => {
  const orginFileName = fileUrl.split('/')[fileUrl.split('/').length - 1] // 获取文件名，格式：tct/ssm/202108020121212/XXX.pdf

  return orginFileName
}

/**
 * @author: yong.li
 * @description: 设置网页标题
 * @param {string} title 标题
 * @return {*}
 */
const setDocumentTitle = (title: string) => {
  const titleStr = GConfig.system.name
  if (typeof document !== 'undefined') {
    return (document.title = title ? `${title} - ${titleStr}` : titleStr)
  }
}

/**
 * @author: yong.li
 * @description: 获取登录用户指定模块所拥有的权限
 * @param {moduleNames} 权限模块名称
 * @return {*}
 */
const getUserModuleGroupAuth = (moduleNames: Array<string>) => {
  const userAuth = localstorage.get('_USER_AUTHCODE')
  const res: ModuleGroupAuth = {}
  if (!moduleNames || !userAuth) {
    return res
  } else {
    if (typeof userAuth === 'object' && userAuth.project instanceof Array && userAuth.global instanceof Array) {
      const allModuleRoles = [].concat(
        userAuth.project.map((s: UserAuthObject) => s.code),
        userAuth.global.map((s: UserAuthObject) => s.code)
      )

      moduleNames.map((moduleName) => {
        const hasModuleRoles = moduleGroupAuthCodeConfig[moduleName]
        let isAuth = false

        if (hasModuleRoles) {
          const hasIntersection = _intersection(hasModuleRoles, allModuleRoles) // 匹配相同值

          isAuth = hasIntersection.length > 0
        }

        res[moduleName] = isAuth
      })

      return res
    } else {
      return res
    }
  }
}

const operate = {
  encrypt,
  decrypt,
  splitUrlParams,
  splitUrlFileName,
  setDocumentTitle,
  getUserModuleGroupAuth
}

export default operate
