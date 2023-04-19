/*
 * @Description:缓存封装工具类
 * @Author: yong.li
 * @Date: 2023-03-06 14:39:11
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-18 14:59:38
 */
'use client'
import operate from './operate'

// interface LocalStorageContent {
//   encrypt?: boolean
//   data: boolean | string | number | KeyValueObject | undefined
// }
// key说明：
// _USER_AUTHCODE:用户权限，_USER_INFO：用户信息，_REMEMBER_LOGIN：是否记住密码，_MENU_STATUS：菜单是否展开，
// _LOGIN_INFO：登录信息（账户密码）

// 免清理key
// const noRemovalKey = [
//   '_REMEMBER_LOGIN', // 是否记住登录账号密码
//   '_LOGIN_INFO' // 登录账号及密码
// ]
// 退出登录需要清理的key
const removeKey = [
  '_USER_AUTHCODE', // 用户权限码
  '_USER_INFO', // 用户信息
  '_MENU_STATUS', // 菜单闭合状态
  '_SELECTED_PROJECT', // 当前选中项目
  '_COMPREHENSIVE_USECASE', // 综合联调测试
  '_SPECIAL_SEQUENCE' //特殊序列制作
]

/**
 * @author: yong.li
 * @description: 删除指定缓存
 * @param {string} name 名称
 * @return {*}
 */
const remove = (name: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(name)
    localStorage.removeItem(name)
  }
}

/**
 * @author: yong.li
 * @description: 清理所有缓存
 * @param {*}
 * @return {*}
 */
const clear = () => {
  if (typeof window !== 'undefined') {
    removeKey.map((key: string) => {
      sessionStorage.removeItem(key)
      localStorage.removeItem(key)
    })
  }
}

/**
 * @author: yong.li
 * @description: 读取指定缓存
 * @param {string} name 名称
 * @return {*}
 */
const get = (name: string) => {
  if (typeof window !== 'undefined') {
    // 优先读取sessionStorage值，若session值不存在再读取localStorage值
    const dataStr = sessionStorage.getItem(name) || localStorage.getItem(name)
    let hash: any
    if (dataStr) {
      // 加入try,catch防止内容变化
      try {
        hash = JSON.parse(dataStr)
        const { encrypt, data } = hash
        let newData = data
        // 如果是加密类型，需要进行解密后返回
        if (encrypt && data) {
          newData = operate.decrypt(data.toString())
        }
        return newData
      } catch {
        return false
      }
    }
  }
  return false
}

/**
 * @author: yong.li
 * @description: 写入缓存
 * @param {string} name 名称
 * @param {object} datas 缓存内容
 * @param {string} type 类型（如：crypto标识为加密对象）
 * @return {*}
 */
const set = (name: string, datas: string | number | boolean | object, encrypt = true) => {
  if (typeof window !== 'undefined') {
    const saveData = {
      encrypt,
      data: encrypt ? operate.encrypt(datas) : datas
    }

    localStorage.setItem(name, JSON.stringify(saveData))
    sessionStorage.setItem(name, JSON.stringify(saveData))

    return true
  }
}

const localstorage = {
  remove,
  clear,
  get,
  set
}

export default localstorage
